"use client";

import React, { useState, useRef, useEffect, CSSProperties } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { hasKeyword, findFaqAnswer } from "@/app/utils/chatbotUtils";
import { FAQItem } from "@/app/data/faqData";

type Mensaje = {
  message: string;
  sender: "bot" | "user";
  widget?: React.ReactNode;
};

const getButtonStyles = (bgColor: string): CSSProperties => ({
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

export const ChatSimple = () => {
  const [messages, setMessages] = useState<Mensaje[]>([
    {
      message: "Hola! Soy Pepito, tu asistente virtual. ¿En qué puedo ayudarte? Puedes preguntar sobre nuestros cursos, métodos de pago, o cualquier duda sobre Bara Creativa HN.",
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
    window.open(url, '_self'); 
  };
 

  const getBotResponse = (input: string): Mensaje => {
    const texto = input.toLowerCase();


    const matchedFaqItem = findFaqAnswer(texto);
    if (matchedFaqItem) {
      return {
        message: matchedFaqItem.answer,
        sender: "bot",
        widget: matchedFaqItem.redirectTo && matchedFaqItem.buttonText ? (
          <button
            onClick={() => handleButtonClick(matchedFaqItem.redirectTo!)}
            style={getButtonStyles("#4f46e5")}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            {matchedFaqItem.buttonText}
          </button>
        ) : undefined,
      };
    }


    if (hasKeyword(texto, "curso") || hasKeyword(texto, "cursos")) {
      return {
        message: "¡Claro! Tenemos cursos muy interesantes para vos. Aquí puedes verlos:",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/cursos")}
            style={getButtonStyles("#4f46e5")}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            Ver Cursos
          </button>
        ),
      };
    }
    if (hasKeyword(texto, "comunidad")) {
      return {
        message: "Te invitamos a conocer nuestra comunidad en Telegram:",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("https://t.me/TuGrupoDeTelegram")}
            style={getButtonStyles("#0ea5e9")}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            Unirme a la Comunidad
          </button>
        ),
      };
    }
    if (hasKeyword(texto, "nosotros") || hasKeyword(texto, "quienes somos")) {
      return {
        message: "Conocé más sobre Bara Creativa HN:",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/nosotros")}
            style={getButtonStyles("#10b981")}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            Sobre Nosotros
          </button>
        ),
      };
    }
    if (hasKeyword(texto, "login") || hasKeyword(texto, "iniciar sesion")) {
      return {
        message: "Iniciá sesión en tu cuenta:",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/login")}
            style={getButtonStyles("#f59e0b")}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            Login
          </button>
        ),
      };
    }
    if (
      hasKeyword(texto, "registro") ||
      hasKeyword(texto, "registrate") ||
      hasKeyword(texto, "registrarse") ||
      hasKeyword(texto, "registrarme") ||
      hasKeyword(texto, "registración")
    ) {
      return {
        message: "Registrate para acceder a todos los cursos y beneficios:",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("/registro")}
            style={getButtonStyles("#ec4899")}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            Registro
          </button>
        ),
      };
    }
    if (hasKeyword(texto, "hola") || hasKeyword(texto, "saludo")) {
      return {
        message: "¡Hola! ¿En qué puedo ayudarte hoy?",
        sender: "bot",
      };
    }
    if (hasKeyword(texto, "gracias")) {
      return {
        message: "¡De nada! Estoy aquí para ayudarte.",
        sender: "bot",
      };
    }
    if (hasKeyword(texto, "contacto") || hasKeyword(texto, "soporte")) {
      return {
        message: "Para soporte directo o preguntas, puedes contactarnos por WhatsApp:",
        sender: "bot",
        widget: (
          <button
            onClick={() => handleButtonClick("https://wa.me/50433351621")}
            style={getButtonStyles("#25d366")}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            WhatsApp (+504 33351621)
          </button>
        ),
      };
    }


    return {
      message: "Perdona, no entendí eso. ¿Querés que te ayude vía WhatsApp?",
      sender: "bot",
      widget: (
        <button
          onClick={() => handleButtonClick("https://wa.me/50433351621")}
          style={getButtonStyles("#25d366")}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
        >
          Contactar por WhatsApp
        </button>
      ),
    };
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

  const maxWidth = 350;
  const maxHeight = 450;
  const minWidth = 320;
  const minHeight = 400;

  const scaleFactor = windowWidth < 1440 ? windowWidth / 1440 : 1;

  const dynamicWidth = Math.max(minWidth, Math.floor(maxWidth * scaleFactor));
  const dynamicHeight = Math.max(minHeight, Math.floor(maxHeight * scaleFactor));

  const containerStyle: CSSProperties = {
    width: dynamicWidth,
    height: dynamicHeight,
    margin: "auto",
    borderRadius: "12px",
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