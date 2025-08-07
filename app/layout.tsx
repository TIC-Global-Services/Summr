import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import LenisProvider from "@/providers/LenisProvider";

const rofane = localFont({
  src: '../font/Rofane.otf',
  variable: '--font-rofane',
})

const helvetica = localFont({
  src: '../font/HelveticaNeueRoman.otf',
  variable: '--font-helvetica',
})

export const metadata: Metadata = {
  title: "Summr - Roll on Deodorant",
  description: "A clean, skin-loving roll-on deodorant made for everyday freshness, naturally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${helvetica.className} ${rofane.variable} antialiased`}
      >
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
