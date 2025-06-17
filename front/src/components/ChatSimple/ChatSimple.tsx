"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

type Mensaje = {
  message: string;
  sender: "bot" | "user";
  widget?: React.ReactNode;
};

export const ChatSimple = () => {
  const [messages, setMessages] = useState<Mensaje[]>([
    {
      message: "Hola! Soy Pepito, tu asistente virtual. ¿En qué puedo ayudarte?",
      sender: "bot",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleButtonClick = (url: string) => {
    window.location.href = url;
  };

  const tienePalabra = (texto: string, palabra: string) => {
    const regex = new RegExp(`\\b${palabra}\\b`, "i");
    return regex.test(texto);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Mensaje = { message: text, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    const botResponse = getBotResponse(text);

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0.5;
        audioRef.current.play();
      }
    }, 1000);
  };

  const getBotResponse = (input: string): Mensaje => {
    const texto = input.toLowerCase();

    if (tienePalabra(texto, "curso") || tienePalabra(texto, "cursos")) {
      return {
        message: "¡Claro! Tenemos cursos muy interesantes para vos.",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/cursos")}
            style={botonEstilo("#4f46e5")}
            onMouseEnter={mouseEntra}
            onMouseLeave={mouseSale}
          >
            Cursos
          </button>
        ),
      };
    }

    if (tienePalabra(texto, "comunidad")) {
      return {
        message: "Te invitamos a conocer nuestra comunidad.",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/comunidad")}
            style={botonEstilo("#0ea5e9")}
            onMouseEnter={mouseEntra}
            onMouseLeave={mouseSale}
          >
            Comunidad
          </button>
        ),
      };
    }
    if (tienePalabra(texto, "nosotros")) {
      return {
        message: "Conocé más sobre Bara Creativa.",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/nosotros")}
            style={botonEstilo("#10b981")}
            onMouseEnter={mouseEntra}
            onMouseLeave={mouseSale}
          >
            Nosotros
          </button>
        ),
      };
    }
    if (tienePalabra(texto, "login")) {
      return {
        message: "Iniciá sesión en tu cuenta.",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/login")}
            style={botonEstilo("#f59e0b")}
            onMouseEnter={mouseEntra}
            onMouseLeave={mouseSale}
          >
            Login
          </button>
        ),
      };
    }
    if (
      tienePalabra(texto, "registro") ||
      tienePalabra(texto, "registrate") ||
      tienePalabra(texto, "registrarse") ||
      tienePalabra(texto, "registrarme") ||
      tienePalabra(texto, "registración")
    ) {
      return {
        message: "Registrate para acceder a todos los cursos.",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/registro")}
            style={botonEstilo("#ec4899")}
            onMouseEnter={mouseEntra}
            onMouseLeave={mouseSale}
          >
            Registro
          </button>
        ),
      };
    }
    if (tienePalabra(texto, "hola")) {
      return {
        message: "¡Hola! ¿Cómo puedo ayudarte hoy?",
        sender: "bot",
      };
    }
    if (tienePalabra(texto, "gracias")) {
      return {
        message: "¡De nada! Estoy aquí para ayudarte.",
        sender: "bot",
      };
    }

    return {
      message: "Perdona, no entendí eso. ¿Querés que te ayude vía WhatsApp?",
      sender: "bot",
      widget: (
        <button
          onClick={() => handleButtonClick("https://wa.me/50433351621")}
          style={botonEstilo("#25d366")}
          onMouseEnter={mouseEntra}
          onMouseLeave={mouseSale}
        >
          WhatsApp
        </button>
      ),
    };
  };

  const botonEstilo = (bgColor: string): React.CSSProperties => ({
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

  const mouseEntra = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.transform = "scale(1.05)";
    target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
  };

  const mouseSale = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.transform = "scale(1)";
    target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  };

  // Calculamos ancho y alto dinámicos para <1440px
  // El tamaño base es 450x550 para 1440px o más
  // Para menor a 1440, escalamos proporcionalmente con un mínimo
  const maxWidth = 350;
  const maxHeight = 450;
  const minWidth = 320;
  const minHeight = 400;

  const scaleFactor = windowWidth < 1440 ? windowWidth / 1440 : 1;

  const dynamicWidth = Math.max(minWidth, Math.floor(maxWidth * scaleFactor));
  const dynamicHeight = Math.max(minHeight, Math.floor(maxHeight * scaleFactor));

  const containerStyle = {
    width: dynamicWidth,
    height: dynamicHeight,
    margin: "auto",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  };

  return (
    <MainContainer style={containerStyle}>
      <audio ref={audioRef} src="/sonidos/NotificacionChatbot.mp4" preload="auto" />
      <ChatContainer>
        <MessageList
          typingIndicator={
            isTyping ? <TypingIndicator content="Pepito está escribiendo..." /> : null
          }
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
              {msg.sender === "bot" && msg.widget && (
                <div style={{ margin: "8px 16px 0" }}>{msg.widget}</div>
              )}
            </div>
          ))}
        </MessageList>
        <MessageInput placeholder="Escribí algo..." onSend={handleSend} />
      </ChatContainer>
    </MainContainer>
  );
};

export default ChatSimple;
