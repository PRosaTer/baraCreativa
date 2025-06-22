import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros - Bara Creativa",
  description: "Conoce nuestra misión, visión, valores e historia",
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
