//src/app/page.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const excelFileInputRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
    
    // Trim input and check for order confirmation
    const trimmedInput = input.trim().toLowerCase();
    
    // Check if input is empty or processing is ongoing
    if (!trimmedInput || isProcessing) return;
  
    try {
      // Add user message to chat
      addMessage(trimmedInput, "user");
      
      // Clear input field
      setInput("");
      
      // Special handling for order confirmation
      if (trimmedInput === 'confirm order') {
        await confirmOrder();
        return;
      }
  
      // Fetch AI response
      await fetchResponse(trimmedInput);
    } catch (error) {
      console.error("Error in message submission:", error);
      
      // Add error message to chat
      addMessage(
        "Oops! Something went wrong. Please try again.",
        "system"
      );
      
      // Restore input if needed
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
      });
  
      // Clear typing indicator
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "WATAD Copilot is Typing...")
      );
  
      // Add bot response
      addMessage(formatBotResponse(data.response), "assistant");
  
      // Check if there's a pending order
      if (data.pendingOrder) {
        // Optionally add a UI hint about pending order
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
  
  // Add a new function to confirm order
  const confirmOrder = async () => {
    try {
      const { data } = await axios.post("/api/chat", {
        action: 'confirmOrder'
      });
  
      // Show success message
      addMessage(`Order confirmed! Order ID: ${data.orderId}`, "system");
    } catch (err) {
      console.error("Error confirming order:", err);
      addMessage("Sorry, there was an issue confirming the order.", "system");
    }
  };

  const startRecording = async () => {
    if (!isProcessing) {
      try {
        setIsProcessing(true);
        setIsRecording(true);

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

          handleAudioUpload(audioBlob);

          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
      } catch (err) {
        console.error("Recording error:", err);
        setError(`Microphone access failed: ${err.message}`);
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

      console.log("Uploading Audio:", {
        type: audioData.type,
        size: audioData.size,
      });

      const { data } = await axios.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (data.transcription) {
        setTranscription(data.transcription);
        addMessage(data.transcription, "user");
        await fetchResponse(data.transcription);
      } else {
        throw new Error("No transcription received");
      }
    } catch (err) {
      console.error("Full upload error:", err.response?.data || err);
      setError(
        `Failed to process the audio: ${
          err.response?.data?.error || err.message
        }`
      );
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // Format the response text with proper headings and newlines
  const formatBotResponse = (responseText) => {
    // Make text between ** and ** bold
    return responseText
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text wrapped in **
      .replace(/\n/g, "<br/>") // Replace newlines with <br/> for HTML line breaks
      .replace(/(Type:)/g, "<strong>$1</strong>") // Bold 'Type' label
      .replace(/(Properties:)/g, "<strong>$1</strong>"); // Bold 'Properties' label
  };

  // New method for Excel file upload and text extraction
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (file && !isProcessing) {
      setIsProcessing(true);
      setLoading(true);
      setError("");

      try {
        const extractedText = await extractTextFromExcel(file);

        if (extractedText) {
          // Convert the extracted text into an HTML table and add it as a message
          const tableHTML = convertTextToTable(extractedText);

          // Add the table as a user message
          addMessage(tableHTML, "user");

          // Initiate conversation with extracted text
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

  // Convert the extracted Excel data into an HTML table
  const convertTextToTable = (text) => {
    const rows = text.split("\n").map((row) => row.split(" | ")); // Assuming data is separated by ' | ' in each row

    let tableHTML =
      "<table class='table-auto w-full border-collapse border border-gray-300'><thead><tr>";

    // Create table headers (first row)
    rows[0].forEach((cell) => {
      tableHTML += `<th class='border px-4 py-2 bg-gray-200'>${cell}</th>`;
    });
    tableHTML += "</tr></thead><tbody>";

    // Create table rows
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

  // Text extraction from Excel
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

            // Convert each row to a string representation
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
      <header className="bg-black text-white p-4 text-center">
        <h1 className="text-2xl font-bold">WATAD Copilot</h1>
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
        <div ref={messagesEndRef} /> {/* Scroll to bottom anchor */}
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
            onClick={startRecording}
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
