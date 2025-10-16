import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RPC Monitor - Blockchain Endpoint Monitoring",
  description:
    "Real-time monitoring of blockchain RPC endpoints with comprehensive health status tracking and performance metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
