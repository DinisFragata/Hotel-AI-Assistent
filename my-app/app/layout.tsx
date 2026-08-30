import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel OS",
  description: "Hotel management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}