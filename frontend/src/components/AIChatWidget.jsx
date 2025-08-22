import React, { useState, useEffect, useRef } from "react";
import GeneralApis from "../apis/GeneralApis";
import { TbMessageChatbot } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { FiSend } from "react-icons/fi";

const formatResponse = (text='') => {
    console.log({text})
  return text.split("\n").map((paragraph, idx) => {
    if (paragraph.trim() === "") return null;

    if (/^(\d+\.\s|\*\s)/.test(paragraph)) {
      return (
        <li key={idx} className="ml-4 list-disc">
          {paragraph.replace(/^(\d+\.\s|\*\s)/, "")}
        </li>
      );
    }

    if (paragraph.includes("**")) {
      const parts = paragraph.split("**");
      return (
        <p key={idx} className="mb-2">
          {parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          )}
        </p>
      );
    }

    return (
      <p key={idx} className="mb-2">
        {paragraph}
      </p>
    );
  });
};

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm FixBot, your ClicknFix assistant. How can I help with your technical issue today?",
      sender: "bot",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const data = await GeneralApis.getChatbotReply(inputMessage);
      const reply = data.reply || "Sorry! I didn't get you.";
      setMessages((prev) => [...prev, { text: reply || "", sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having connection issues. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-110"
            aria-label="Open AI chat"
          >
            <TbMessageChatbot className="h-8 w-8" />
          </button>
          <p className="text-slate-500">FixBot</p>
        </div>
      )}

      {/* Chat Dialog */}
      {isOpen && (
        <div className="flex flex-col w-80 h-96 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
              <h3 className="font-semibold">ClicknFix Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <IoMdClose className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {formatResponse(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyUp={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg h-10 px-4 outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputMessage.trim()}
                className={`bg-blue-600 text-white px-4 h-10 rounded-r-lg hover:bg-blue-700 transition-colors ${
                  isLoading || !inputMessage.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <FiSend className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
