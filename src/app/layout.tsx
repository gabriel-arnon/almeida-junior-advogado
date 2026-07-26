import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/MotionProvider";
import { createMetadata } from "@/lib/metadata";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${cormorant.variable} min-h-screen bg-white text-graphite antialiased`}
      >
        <MotionProvider />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
