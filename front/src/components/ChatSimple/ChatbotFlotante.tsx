"use client";

import React, { useState } from "react";
import ChatSimple from "./ChatSimple";

const ChatbotFlotante = () => {
  const [mostrarChat, setMostrarChat] = useState(false);

  const toggleChat = () => {
    setMostrarChat((prev) => !prev);
  };

  return (
    <>

      {!mostrarChat && (
        <img
          src="/chatbot.png"
          alt="Pepito"
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        />
      )}


      {mostrarChat && (
        <div
          style={{
            position: "fixed",
            bottom: "40px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <div style={{ position: "relative" }}>
            <button
              onClick={toggleChat}
              style={{
                position: "absolute",
                top: "-30px",
                right: "-12px",
                backgroundColor: "#ef4444",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
              aria-label="Cerrar chat"
            >
              ×
            </button>
            <ChatSimple />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotFlotante;
