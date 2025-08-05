"use client";

import React, { useRef, useEffect, useState } from "react";
import { Mensaje } from "@/app/types/chatTypes";
import { useChatBot } from "@/app/hooks/chatbot/useChatBot";
import ChatButton from "./ChatButton";

const ChatSimple = () => {
  const { messages, isTyping, handleSend, containerStyle, audioRef } =
    useChatBot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");


  const getButtonStyles = (bgColor: string): React.CSSProperties => ({
    backgroundColor: bgColor,
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "8px 14px",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  });


  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.transform = "scale(1.05)";
    target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.transform = "scale(1)";
    target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  };

  const handleButtonClick = (url: string) => {
    window.open(url, "_self");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      handleSend(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex flex-col bg-white rounded-lg shadow-xl"
      style={containerStyle}
    >
      <audio
        ref={audioRef}
        src="/sonidos/NotificacionChatbot.mp4"
        preload="auto"
      />

  
      <div className="flex items-center p-4 bg-blue-600 text-white rounded-t-lg shadow-md">
        <img
          src="/chatbot.png"
          alt="Pepito Avatar"
          className="w-10 h-10 rounded-full mr-3 border-2 border-white"
        />
        <h2 className="text-lg font-semibold">Pepito, tu asistente</h2>
      </div>


      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {messages.map((msg: Mensaje, i: number) => (
          <div
            key={i}
            className={`flex mb-4 ${
              msg.sender === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                msg.sender === "bot"
                  ? "bg-gray-200 text-gray-800 rounded-bl-none"
                  : "bg-blue-500 text-white rounded-br-none"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              {msg.sender === "bot" && msg.widget && (
                <div className="mt-2">
              
                  {(() => {
                    const widget = msg.widget;
                    return (
                      <ChatButton
                        bgColor={widget.buttonColor}
                        onClick={() => handleButtonClick(widget.buttonUrl)}
                      >
                        {widget.buttonText}
                      </ChatButton>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg shadow-sm rounded-bl-none">
              <p className="text-sm italic">Pepito está escribiendo...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> 
      </div>


      <div className="p-4 border-t border-gray-200 flex items-center">
        <input
          type="text"
          placeholder="Escribí algo..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Enviar
        </button>
      </div>

    
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ChatSimple;
