import { useEffect, useRef } from "react";

interface Props {
  url: string;
  onClose: () => void;
}

export const ModalExterno = ({ url, onClose }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const manejarEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const manejarClickFuera = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", manejarEscape);
    document.addEventListener("mousedown", manejarClickFuera);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg overflow-hidden w-[90%] max-w-3xl h-[80%] shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 z-10"
        >
          ✕
        </button>
        <iframe
          src={url}
          className="w-full h-full border-none"
          title="Información externa"
        />
      </div>
    </div>
  );
};
