import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'sweetalert2/src/sweetalert2.scss'
import { ThemeModeScript } from "flowbite-react";
import { Suspense } from "react";
import Loading from './loading'
import NavSideWrapper from "./components/NavSideWrapper/navSideWrapper";
import { auth } from "@/auth";




const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Rajan",
  description: "Stock Management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <ThemeModeScript /> */}

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="h-auto mx-auto">
            {children}
        </main>
      </body>
    </html>
  );
}
