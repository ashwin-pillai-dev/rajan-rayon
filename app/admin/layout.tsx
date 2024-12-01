import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";
import { Suspense } from "react";
import Loading from './loading'
import NavSideWrapper from "./components/NavSideWrapper/navSideWrapper";
import 'sweetalert2/src/sweetalert2.scss'
import { auth } from "@/auth";





// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const user: { name: string, email: string } = {
    name: session?.user?.name ? session?.user?.name : '',
    email: session?.user?.email ? session?.user?.email : '',
  }
  return (
    <section>
      <NavSideWrapper user={user} />
      <section className="md:ml-64 h-auto pt-20">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </section>
    </section>


  );
}
