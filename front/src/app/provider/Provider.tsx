'use client';

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #facc15",
          },
          iconTheme: {
            primary: "#facc15",
            secondary: "#1f2937",
          },
          duration: 4000,
        }}
      />
    </>
  );
}
