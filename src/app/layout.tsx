import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LiveblocksProvider } from "@liveblocks/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeltaPlant",
  description: "Delta Force strategy planning workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LiveblocksProvider
          authEndpoint="/api/liveblocks-auth"
          throttleDelay={16}
          baseUrl={process.env.NEXT_PUBLIC_APP_URL}
        >
          {children}
        </LiveblocksProvider>
      </body>
    </html>
  );
}
