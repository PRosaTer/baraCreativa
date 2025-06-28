import React, { CSSProperties } from "react";

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

const ChatButton: React.FC<{
  bgColor: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ bgColor, onClick, children }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  };

  return (
    <button
      style={getButtonStyles(bgColor)}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default ChatButton;
