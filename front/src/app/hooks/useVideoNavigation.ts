import { useState } from "react";

export const useVideoNavigation = (videoCount: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => setCurrentIndex((prev) => (prev + 1) % videoCount);
  const prevVideo = () => setCurrentIndex((prev) => (prev - 1 + videoCount) % videoCount);

  return { currentIndex, nextVideo, prevVideo };
};