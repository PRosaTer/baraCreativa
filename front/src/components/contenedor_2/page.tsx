"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";

const HeavyComponent = () => {
  return (
    <div className="w-[667px] h-[592px] bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
      <VideoSlider />
    </div>
  );
};

export default HeavyComponent;
