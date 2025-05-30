import { useEffect } from "react";

export const useVideoTimeControl = (
  videoRefs: React.RefObject<(HTMLVideoElement | null)[]>,
  currentIndex: number,
  videoCount: number,
  startTime: number = 2
) => {
  useEffect(() => {
    const visibleIndexes = [
      currentIndex,
      (currentIndex - 1 + videoCount) % videoCount,
      (currentIndex + 1) % videoCount
    ];

    visibleIndexes.forEach(index => {
      const video = videoRefs.current?.[index];
      if (video) {
        video.currentTime = startTime;
      }
    });
  }, [currentIndex, videoRefs, videoCount, startTime]);
};