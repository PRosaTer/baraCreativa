"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { useVideoNavigation } from "../../app/hooks/useVideoNavigation";

const videos = [
  // "https://www.youtube.com/watch?v=riCP9x31Kuk",
  "TESTIMONIO-FERNANDO-AREVALO.mp4",
  "TESTIMONIO-DEBORA-SALGUERO.mp4",
  "TESTIMONIO-CANDIDA-MARTINEZ.mp4"
  
];

const VideoSlider = () => {
  const { currentIndex, nextVideo, prevVideo } = useVideoNavigation(videos.length);

  return (
    <div className="relative w-[214px] h-[305px] mr-24 -mt-56 flex items-center justify-center">
      <div className="relative w-full h-full">
        {videos.map((video, index) => {
          const position = (index - currentIndex + videos.length) % videos.length;
          const isActive = position === 0;
          const isPrev = position === videos.length - 1;
          const isNext = position === 1;

          return (
            <div
              key={video}
              className={`absolute transition-all duration-500 ease-in-out rounded-lg
                w-full h-full ${
                isActive
                  ? "z-20 scale-100 opacity-100 left-1/2 transform -translate-x-1/2"
                  : isPrev
                  ? "opacity-50 z-10 scale-90 left-0 transform translate-x-0"
                  : isNext
                  ? "opacity-50 z-10 scale-90 right-0 transform translate-x-0"
                  : "hidden"
              }`}
            >
              <ReactPlayer
                url={video}
                width="305px"
                height="214px"
                controls
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={prevVideo}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextVideo}
        className="absolute -right-16 top-1/2 transform -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default VideoSlider;
