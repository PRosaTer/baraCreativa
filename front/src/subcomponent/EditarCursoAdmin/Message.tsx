// components/Message.tsx
import React from "react";

interface MessageProps {
  message: string;
  type: "error" | "success";
}

export const Message: React.FC<MessageProps> = ({ message, type }) => (
  <p
    style={{
      color: type === "error" ? "#8b0000" : "#065f46",
      fontWeight: "700",
      marginBottom: 20,
    }}
  >
    {message}
  </p>
);
