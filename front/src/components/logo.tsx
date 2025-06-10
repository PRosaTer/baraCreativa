// import Image from 'next/image';

// export default function Logo() {
//   return (
//     <div className="w-[66px] h-[53px] flex-shrink-0 flex items-center">
//       <Image
//         src="/logo-bc.png"
//         alt="Bara Creativa Logo"
//         width={66}
//         height={53}
//         priority
//       />
//     </div>
//   );
// }

//Difuminacion

// import Image from 'next/image';
// import { useState, useEffect } from 'react';

// export default function Logo() {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoaded(true);
//     }, 200);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="relative w-[66px] h-[53px] flex-shrink-0 flex items-center">
//       <Image
//         src="/logo-bc.png"
//         alt="Bara Creativa Logo"
//         width={66}
//         height={53}
//         priority
//         className={`transition-all duration-100 ease-in-out ${loaded ? 'blur-0 opacity-100' : 'blur-sm opacity-60'}`}
//       />
//     </div>
//   );
// }


//zumbido

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Logo() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href="/" className="flex items-center">
      <div
        className={`w-[66px] h-[53px] flex-shrink-0 flex items-center cursor-pointer ${
          animate ? "animate-shake-twice-pause" : ""
        }`}
      >
        <Image
          src="/logo-bc.png"
          alt="Bara Creativa Logo"
          width={66}
          height={53}
          priority
        />
      </div>
    </Link>
  );
}
