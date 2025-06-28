import { useState, useRef, useEffect } from "react";

export type Mensaje = {
  message: string;
  sender: "bot" | "user";
  widget?: {
    buttonText: string;
    buttonColor: string;
    buttonUrl: string;
  };
};


import { hasKeyword, findFaqAnswer } from "@/app/utils/chatbotUtils";

type UseChatBotReturn = {
  messages: Mensaje[];
  isTyping: boolean;
  windowWidth: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  handleSend: (text: string) => void;
  containerStyle: React.CSSProperties;
};

export const useChatBot = (): UseChatBotReturn => {
  const [messages, setMessages] = useState<Mensaje[]>([
    {
      message:
        "Hola! Soy Pepito, tu asistente virtual. ¿En qué puedo ayudarte? Puedes preguntar sobre nuestros cursos, métodos de pago, o cualquier duda sobre Bara Creativa HN.",
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

  const getBotResponse = (input: string): Mensaje => {
    const texto = input.toLowerCase();

    const matchedFaqItem = findFaqAnswer(texto);
    if (matchedFaqItem) {
      return {
        message: matchedFaqItem.answer,
        sender: "bot",
        widget:
          matchedFaqItem.redirectTo && matchedFaqItem.buttonText
            ? {
                buttonText: matchedFaqItem.buttonText,
                buttonColor: "#4f46e5",
                buttonUrl: matchedFaqItem.redirectTo,
              }
            : undefined,
      };
    }

    if (hasKeyword(texto, "curso") || hasKeyword(texto, "cursos")) {
      return {
        message: "¡Claro! Tenemos cursos muy interesantes para vos. Aquí puedes verlos:",
        sender: "bot",
        widget: {
          buttonText: "Ver Cursos",
          buttonColor: "#4f46e5",
          buttonUrl: "/cursos",
        },
      };
    }
    if (hasKeyword(texto, "comunidad")) {
      return {
        message: "Te invitamos a conocer nuestra comunidad en Telegram:",
        sender: "bot",
        widget: {
          buttonText: "Unirme a la Comunidad",
          buttonColor: "#0ea5e9",
          buttonUrl: "https://t.me/TuGrupoDeTelegram",
        },
      };
    }
    if (hasKeyword(texto, "nosotros") || hasKeyword(texto, "quienes somos")) {
      return {
        message: "Conocé más sobre Bara Creativa HN:",
        sender: "bot",
        widget: {
          buttonText: "Sobre Nosotros",
          buttonColor: "#10b981",
          buttonUrl: "/nosotros",
        },
      };
    }
    if (hasKeyword(texto, "login") || hasKeyword(texto, "iniciar sesion")) {
      return {
        message: "Iniciá sesión en tu cuenta:",
        sender: "bot",
        widget: {
          buttonText: "Login",
          buttonColor: "#f59e0b",
          buttonUrl: "/login",
        },
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
        widget: {
          buttonText: "Registro",
          buttonColor: "#ec4899",
          buttonUrl: "/registro",
        },
      };
    }
    if (hasKeyword(texto, "hola") || hasKeyword(texto, "saludo")) {
      return { message: "¡Hola! ¿En qué puedo ayudarte hoy?", sender: "bot" };
    }
    if (hasKeyword(texto, "gracias")) {
      return { message: "¡De nada! Estoy aquí para ayudarte.", sender: "bot" };
    }
    if (hasKeyword(texto, "contacto") || hasKeyword(texto, "soporte")) {
      return {
        message: "Para soporte directo o preguntas, puedes contactarnos por WhatsApp:",
        sender: "bot",
        widget: {
          buttonText: "WhatsApp (+504 33351621)",
          buttonColor: "#25d366",
          buttonUrl: "https://wa.me/50433351621",
        },
      };
    }

    return {
      message: "Perdona, no entendí eso. ¿Querés que te ayude vía WhatsApp?",
      sender: "bot",
      widget: {
        buttonText: "Contactar por WhatsApp",
        buttonColor: "#25d366",
        buttonUrl: "https://wa.me/50433351621",
      },
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

  const containerStyle: React.CSSProperties = {
    width: dynamicWidth,
    height: dynamicHeight,
    margin: "auto",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  };

  return { messages, isTyping, windowWidth, audioRef, handleSend, containerStyle };
};
