import type { Metadata } from "next";
import { Silkscreen, Baloo_2 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const pixelFont = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pixel",
});

const bodyFont = Baloo_2({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Website KKN Kolaborasi",
  description:
    "Platform informasi, merchandise, dan pendaftaran acara penutupan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${pixelFont.variable} ${bodyFont.variable} font-body antialiased text-navy`}
      >
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}