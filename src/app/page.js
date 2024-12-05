//src/app/page.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
 // Language state with client-side localStorage handling
 const [selectedLanguage, setSelectedLanguage] = useState('en-US');

 // Language options
 const languageOptions = [
   { code: "en-US", label: "English (US)" },
   { code: "ar-SA", label: "Arabic (Saudi Arabia)" }
 ];

// Effect to save language to localStorage whenever it changes
useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }
}, [selectedLanguage]);

// Effect to load language from localStorage on client-side mount
useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }
}, []);

const mediaRecorderRef = useRef(null);
const audioRef = useRef(null);
const fileInputRef = useRef(null);
const excelFileInputRef = useRef(null);
const audioChunksRef = useRef([]);
const messagesEndRef = useRef(null);
const inputRef = useRef(null);

  const prepareStartRecording = () => {
    startRecording();
  };

  // Autoscroll effect
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Autofocus effect
  useEffect(() => {
    if (!isProcessing) {
      inputRef.current?.focus();
    }
  }, [isProcessing]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    audioRef.current = new Audio("/msg-popup.mp3");
  }, []);

  const addMessage = (text, type) => {
    const newMessage = { id: Date.now(), text, type };
    setMessages((prev) => [...prev, newMessage]);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const trimmedInput = input.trim().toLowerCase();
    
    if (!trimmedInput || isProcessing) return;
  
    try {
      addMessage(trimmedInput, "user");
      
      setInput("");
      
      if (trimmedInput === 'confirm order') {
        await confirmOrder();
        return;
      }
  
      await fetchResponse(trimmedInput);
    } catch (error) {
      console.error("Error in message submission:", error);
      
      addMessage(
        "Oops! Something went wrong. Please try again.",
        "system"
      );
      
      setInput(trimmedInput);
    }
  };


  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSubmit(event);
    }
  };

  const fetchResponse = async (userInput) => {
    setIsProcessing(true);
    addMessage("WATAD Copilot is Typing...", "assistant");
    try {
      const { data } = await axios.post("/api/chat", {
        userMessage: userInput,
        language: selectedLanguage // Pass selected language to backend
      });
  
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "WATAD Copilot is Typing...")
      );
  
      addMessage(formatBotResponse(data.response), "assistant");
  
      if (data.pendingOrder) {
        addMessage("An order is pending confirmation. Type 'Confirm Order' to proceed.", "system");
      }
  
      audioRef.current?.play();
    } catch (err) {
      console.error("Error fetching response:", err);
      addMessage(
        "Sorry - Something went wrong. Please try again!",
        "assistant"
      );
    } finally {
      setIsProcessing(false);
    }
  };
  
  const confirmOrder = async () => {
    try {
      const { data } = await axios.post("/api/chat", {
        action: 'confirmOrder'
      });
  
      addMessage(`Order confirmed! Order ID: ${data.orderId}`, "system");
    } catch (err) {
      console.error("Error confirming order:", err);
      addMessage("Sorry, there was an issue confirming the order.", "system");
    }
  };

  const startRecording = async () => {
    if (!isProcessing) {
      try {
        // Check for microphone permissions
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          addMessage('<span class="text-red-500">Error: Microphone access not supported</span>', "system");
          return;
        }
  
        setIsProcessing(true);
        setIsRecording(true);
        setError("");
  
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
  
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm; codecs=opus",
        });
  
        audioChunksRef.current = [];
  
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
  
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm; codecs=opus",
          });
  
          if (audioBlob.size > 0) {
            handleAudioUpload(audioBlob);
          } else {
            addMessage('<span class="text-red-500">No audio recorded. Please try again.</span>', "system");
          }
  
          stream.getTracks().forEach((track) => track.stop());
        };
  
        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
      } catch (err) {
        console.error("Recording error:", err);
        
        // Detailed error messages based on different scenarios
        let errorMsg = "Microphone access failed";
        if (err.name === "NotAllowedError") {
          errorMsg = "Microphone permission denied. Please check your browser settings.";
        } else if (err.name === "NotFoundError") {
          errorMsg = "No microphone found. Please connect a microphone.";
        }
  
        // Add error to chat and error state
        addMessage(`<span class="text-red-500">Recording Error: ${errorMsg}</span>`, "system");
        setError(errorMsg);
        
        setIsProcessing(false);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && !isProcessing) {
      setIsProcessing(true);
      await handleAudioUpload(file);
    }
  };


  const handleAudioUpload = async (audioData) => {
    setLoading(true);
    setError("");
    addMessage("Uploading audio...", "user");
  
    try {
      const formData = new FormData();
      formData.append("audio", audioData, "recording.opus");
      formData.append("language", selectedLanguage);
  
      console.log("Uploading Audio:", {
        type: audioData.type,
        size: audioData.size,
        language: selectedLanguage
      });
  
      const { data } = await axios.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
  
      if (data.transcription) {
        addMessage(data.transcription, "user");
        await fetchResponse(data.transcription);
      } else {
        throw new Error("No transcription received");
      }
    } catch (err) {
      console.error("Full upload error:", err.response?.data || err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error";
      
      // Add error message to chat with red color
      addMessage(`<span class="text-red-500">Audio Upload Error: ${errorMessage}</span>`, "system");
      
      // Set more detailed error state
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };
  

  const formatBotResponse = (responseText) => {
    return responseText
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
      .replace(/\n/g, "<br/>")
      .replace(/(Type:)/g, "<strong>$1</strong>") 
      .replace(/(Properties:)/g, "<strong>$1</strong>"); 
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (file && !isProcessing) {
      setIsProcessing(true);
      setLoading(true);
      setError("");

      try {
        const extractedText = await extractTextFromExcel(file);

        if (extractedText) {
          const tableHTML = convertTextToTable(extractedText);
          addMessage(tableHTML, "user");
          await fetchResponse(extractedText);
        }
      } catch (err) {
        console.error("Error processing Excel file:", err);
        setError("Failed to process the Excel file.");
      } finally {
        setLoading(false);
        setIsProcessing(false);
      }
    }
  };

  const convertTextToTable = (text) => {
    const rows = text.split("\n").map((row) => row.split(" | ")); 

    let tableHTML =
      "<table class='table-auto w-full border-collapse border border-gray-300'><thead><tr>";

    rows[0].forEach((cell) => {
      tableHTML += `<th class='border px-4 py-2 bg-gray-200'>${cell}</th>`;
    });
    tableHTML += "</tr></thead><tbody>";

    rows.slice(1).forEach((row) => {
      tableHTML += "<tr>";
      row.forEach((cell) => {
        tableHTML += `<td class='border px-4 py-2'>${cell}</td>`;
      });
      tableHTML += "</tr>";
    });

    tableHTML += "</tbody></table>";
    return tableHTML;
  };

  const extractTextFromExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: "binary" });
          let fullText = "";

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            });

            sheetData.forEach((row) => {
              const rowText = row
                .map((cell) => (cell !== undefined ? String(cell).trim() : ""))
                .join(" | ");

              fullText += rowText + "\n";
            });
          });

          resolve(fullText.trim());
        } catch (error) {
          console.error("Error extracting text from Excel:", error);
          reject(error);
        }
      };
      reader.readAsBinaryString(file);
    });
  };

  return (
    <main className="fixed h-full w-full bg-gray-50 flex flex-col">
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">WATAD Copilot</h1>
      <div>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-2 py-1 rounded bg-white text-black"
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                msg.type === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-gray-200">
        <textarea
          ref={inputRef}
          className="w-full mb-2 p-3 border rounded resize-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading || isProcessing}
        />
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            onClick={prepareStartRecording}
            className={`px-3 py-2 rounded text-sm ${
              isProcessing
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 text-white"
            }`}
            disabled={isProcessing}
          >
            {isRecording ? "Recording..." : "Start Recording"}
          </button>
          
          <button
            onClick={stopRecording}
            className={`px-3 py-2 rounded text-sm ${
              isRecording
                ? "bg-red-500 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
            disabled={!isRecording}
          >
            Stop Recording
          </button>
          
          <label className="px-3 py-3 rounded bg-yellow-500 text-white text-sm">
            Upload Audio
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={loading || isProcessing}
              className="hidden"
              ref={fileInputRef}
            />
          </label>
          <button
            onClick={() => excelFileInputRef.current?.click()}
            className={`px-3 py-2 rounded text-sm ${
              isProcessing
                ? "bg-gray-300 text-gray-500"
                : "bg-green-500 text-white"
            }`}
            disabled={isProcessing}
          >
            Upload Excel
          </button>
          <input
            ref={excelFileInputRef}
            type="file"
            className="hidden"
            onChange={handleExcelUpload}
            accept=".xlsx,.xls"
          />
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white text-sm ${
              isProcessing || loading
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500"
            }`}
            disabled={isProcessing || loading}
          >
            Send
          </button>
        </div>
      </footer>
    </main>
  );
}
