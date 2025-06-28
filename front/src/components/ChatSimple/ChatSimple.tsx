"use client";

import React from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { useChatBot, Mensaje } from "@/app/hooks/chatbot/useChatBot";

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

export const ChatSimple = () => {
  const { messages, isTyping, handleSend, containerStyle, audioRef } = useChatBot();

  return (
    <MainContainer style={containerStyle}>
      <audio ref={audioRef} src="/sonidos/NotificacionChatbot.mp4" preload="auto" />
      <ChatContainer>
        <MessageList
          typingIndicator={isTyping ? <TypingIndicator content="Pepito está escribiendo..." /> : null}
        >
          {messages.map((msg, i) => (
            <div key={i}>
              <Message
                model={{
                  message: msg.message,
                  sentTime: "Ahora",
                  sender: msg.sender === "bot" ? "Pepito" : "Tú",
                  direction: msg.sender === "bot" ? "incoming" : "outgoing",
                  position: "single",
                }}
              />
             {msg.sender === "bot" && msg.widget && (() => {
  const widget = msg.widget;
  return (
    <div style={{ margin: "8px 16px 0" }}>
      <button
        onClick={() => handleButtonClick(widget.buttonUrl)}
        style={getButtonStyles(widget.buttonColor)}
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        {widget.buttonText}
      </button>
    </div>
  );
})()}

            </div>
          ))}
        </MessageList>
        <MessageInput placeholder="Escribí algo..." onSend={handleSend} />
      </ChatContainer>
    </MainContainer>
  );
};

export default ChatSimple;
