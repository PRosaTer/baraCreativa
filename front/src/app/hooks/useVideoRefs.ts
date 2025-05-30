import { useRef, useEffect } from "react";

const useVideoRefs = (videoCount: number) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current = Array(videoCount).fill(null);
  }, [videoCount]);

  return videoRefs;
};

export default useVideoRefs;
