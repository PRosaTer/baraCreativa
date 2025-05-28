"use client"

import React from 'react';

export default function ComunidadButton() {
  return (
<button className="min-w-[88px] sm:min-w-[72px] md:min-w-[80px] lg:min-w-[88px] 
                    h-[53px] sm:h-[45px] md:h-[50px] lg:h-[53px] 
                    ml-[74px] sm:ml-[40px] md:ml-[60px] lg:ml-[54px] 
                    flex items-center justify-center text-foreground font-medium px-4 
                    rounded-[40px] bg-[#F2E4E4] relative overflow-hidden group">
  <span className="absolute inset-0 rounded-[40px] border-4 border-transparent bg-gradient-to-r from-red-600 via-yellow-400 to-white bg-[length:300%_300%] opacity-0 group-hover:opacity-100 animate-gradient-move pointer-events-none"></span>
  <span className="relative z-10">Comunidad</span>
</button>

  );
}
