import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import "../styles/chat.css";

const Chat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

 
  const handleEdit = (messageId) => {
    const messageToEdit = messages.find((msg) => msg.id === messageId);
    if (messageToEdit) {
      setInputMessage(messageToEdit.content);
      setEditingMessageId(messageId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);
    const currentInput = inputMessage;

    try {
      setIsLoading(true);
      setError("");

      if (editingMessageId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessageId
              ? { ...msg, content: currentInput }
              : msg
          )
        );
        setEditingMessageId(null);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "user",
            content: currentInput,
            timestamp: new Date().toISOString(),
          },
        ]);
      }

      setInputMessage("");

      const analyzeSentiment = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3125/api/sentiment",
            { text: currentInput },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              timeout: 30000,
            }
          );
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: "system",
              content: `Sentiment: ${response.data.sentiment}`,
              timestamp: new Date().toISOString(),
            },
          ]);
        } catch (error) {
          console.error("Sentiment analysis error:", error);
        }
      };
      analyzeSentiment();

      const response = await axios.post(
        "http://localhost:3125/api/suggest",
        { prompt: currentInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
          signal: controller.signal,
        }
      );

      const aiResponse =
        response.data.suggestion ||
        response.data.response ||
        response.data.data ||
        response.data;
      const responseText =
        typeof aiResponse === "object"
          ? aiResponse.suggestion || JSON.stringify(aiResponse)
          : aiResponse;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: responseText,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setInputMessage(currentInput);
      handleError(error);
    } finally {
      clearTimeout(timeoutId);
      controller.abort();
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (messages.length === 0 || isLoading) return;

    try {
      setIsSummarizing(true);
      setError("");

      const messagesToSummarize = messages.filter(
        (msg) => msg.role === "user" || msg.role === "assistant"
      );

      const response = await axios.post(
        "http://localhost:3125/api/summarize",
        { messages: messagesToSummarize },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "system",
          content: `Summary: ${response.data.summary}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setError("Failed to generate summary. Please try again.");
      console.error("Summarization error:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleError = (error) => {
    if (error.code === "ERR_CANCELED") {
      setError("Request canceled. Please try again.");
    } else if (error.code === "ECONNABORTED") {
      setError("Request timed out. Please try again.");
    } else if (error.response?.status === 401) {
      setError("Session expired. Please log in again.");
    } else {
      setError(`Error: ${error.response?.data?.error || error.message}`);
    }
    console.error("API Error Details:", {
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
      config: error.config,
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2> AI Assistant</h2>
        <div className="header-controls">
          <button
            className="summarize-btn"
            onClick={handleSummarize}
            disabled={isSummarizing || isLoading || messages.length === 0}
          >
            {isSummarizing ? "Summarizing..." : "Summarize"}
          </button>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
              {msg.role === "system" && (
                <span className="system-tag">System Analysis</span>
              )}
              {msg.role === "user" && (
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(msg.id)}
                  disabled={isLoading}
                >
                  <FaEdit />
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : editingMessageId ? "Update" : "Send"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Chat;
