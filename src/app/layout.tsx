import type { Metadata } from "next";
import { Fredoka, Baloo_2 } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { CartProvider } from "@/context/CartContext";

const displayFont = Fredoka({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-pixel",
});

const bodyFont = Baloo_2({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Summer 2026",
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
        className={`${displayFont.variable} ${bodyFont.variable} font-body antialiased text-navy`}
      >
        <CartProvider>
          <ConditionalNavbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
