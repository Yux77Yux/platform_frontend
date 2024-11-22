import type { Metadata } from "next";
import "./globals.css";
// import AppProvider from "../components/Provider/AppProvider";

export const metadata: Metadata = {
  title: "Platform creation",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <main>{children}</main>
      </body>
    </html>
  );
}
