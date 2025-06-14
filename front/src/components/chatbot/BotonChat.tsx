import React from "react";
import Image from "next/image";

interface Props {
  alHacerClick: () => void;
}

const BotonChat: React.FC<Props> = ({ alHacerClick }) => (
  <button
    onClick={alHacerClick}
    className="fixed bottom-1 right-2 z-50 w-[50px] h-[50px] md:w-[90px] md:h-[90px]"
  >
    <Image
      src="/chatbot.png"
      alt="Chatbot Pepito"
      width={60}
      height={60}
      className="w-full h-full object-contain"
    />
  </button>
);

export default BotonChat;
