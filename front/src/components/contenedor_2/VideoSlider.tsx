"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { useVideoNavigation } from "../../app/hooks/useVideoNavigation";
import { useState, useEffect } from "react";

const videos = [
  { src: "TESTIMONIO-FERNANDO-AREVALO.mp4", name: "Fernando Arevalo" },
  { src: "TESTIMONIO-DEBORA-SALGUERO.mp4", name: "Débora Salguero" },
  { src: "TESTIMONIO-CANDIDA-MARTINEZ.mp4", name: "Cándida Martínez" },
];

const VideoSlider = () => {
  const { currentIndex, nextVideo, prevVideo } = useVideoNavigation(videos.length);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [currentIndex]);

  return (
    <div className="relative w-[600px] h-[500px] -mt-50 flex flex-col items-center justify-center">
      {/* Nombre arriba */}
      <div className="w-full text-center py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-white font-semibold rounded-t-lg select-none">
        {videos[currentIndex].name}
      </div>

      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {videos.map(({ src }, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={src}
              className={`absolute transition-all duration-500 ease-in-out w-full h-full ${
                isActive
                  ? "z-20 scale-100 opacity-100 left-1/2 transform -translate-x-1/2"
                  : "hidden"
              }`}
            >
              <ReactPlayer
                url={src}
                width="100%"
                height="100%"
                controls
                playing={isActive && isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                config={{
                  file: {
                    attributes: {
                      style: {
                        objectFit: "cover",
                        width: "200%",
                        height: "50%",
                      },
                    },
                  },
                }}
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          prevVideo();
          setIsPlaying(false);
        }}
        className="absolute left-6 -mt-[100px] top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => {
          nextVideo();
          setIsPlaying(false);
        }}
        className="absolute right-4 -mt-[100px] top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default VideoSlider;
