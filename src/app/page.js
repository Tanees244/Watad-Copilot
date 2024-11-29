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

  useEffect(() => {
    audioRef.current = new Audio("/msg-popup.mp3");
  }, []);

  const addMessage = (text, type) => {
    const newMessage = { id: Date.now(), text, type };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.trim() && !isProcessing) {
      addMessage(input, "user");
      setInput("");
      await fetchResponse(input);
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
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "WATAD Copilot is Typing...")
      );
      addMessage(data.response, "assistant");
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

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (file && !isProcessing) {
      setIsProcessing(true);
      setLoading(true);
      setError("");

      try {
        const extractedData = await extractTableDataFromExcel(file);

        if (extractedData) {
          setTableData(extractedData);

          const extractedText = extractedData
            .map((row) => row.join(" | "))
            .join("\n");
          addMessage(extractedText, "user");
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

  const extractTableDataFromExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: "binary" });
          let tableData = [];

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            });
            tableData = tableData.concat(sheetData);
          });

          resolve(tableData);
        } catch (error) {
          console.error("Error extracting table data from Excel:", error);
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
            >
              {msg.text === "WATAD Copilot is Typing..." ? (
                <div className="animate-pulse text-gray-500 italic">
                  WATAD Copilot is Typing...
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <footer className="p-4 bg-gray-200">
        <textarea
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
          <label className="px-3 py-2 rounded bg-yellow-500 text-white text-sm">
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
          <label className="px-3 py-2 rounded bg-green-500 text-white text-sm">
            Upload Excel
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleExcelUpload}
              disabled={loading || isProcessing}
              className="hidden"
              ref={excelFileInputRef}
            />
          </label>
        </div>
      </footer>
    </main>
  );
}
