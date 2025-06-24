import type { Metadata } from "next";
import "./globals.css";
import WhatsApp from "../components/whatsapp/WhatsApp";
import Footer from "@/components/Footer/Footer";
import ChatbotFlotante from "@/components/ChatSimple/ChatbotFlotante";
import RootLayoutContent from './RootLayoutContent';

export const metadata: Metadata = {
  title: "Bara Creativa - Edtech Hondureña",
  description: "Edtech hondureña que ofrece cursos e-learning y presenciales de alto impacto, con metodologías innovadoras y tecnología práctica.",
  keywords: ["Edtech", "Honduras", "cursos", "e-learning", "presenciales", "formación", "tecnología educativa"],
  openGraph: {
    title: "Bara Creativa - Edtech Hondureña",
    description: "Edtech hondureña que ofrece cursos e-learning y presenciales de alto impacto.",
    url: "https://www.baracreativa.com",
    siteName: "Bara Creativa",
    images: [
      {
        url: "https://www.baracreativa.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bara Creativa",
      },
    ],
    locale: "es_HN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bara Creativa - Edtech Hondureña",
    description: "Edtech hondureña que ofrece cursos e-learning y presenciales de alto impacto.",
    creator: "@baracreativa_hn",
    images: ["https://www.baracreativa.com/twitter-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased flex flex-col min-h-screen bg-background text-foreground">
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
        <WhatsApp />
        <ChatbotFlotante />
        <Footer />
      </body>
    </html>
  );
}
