import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pinboard — tarat & margo",
  description: "A shared pinboard for links, ideas, and things to explore later",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white text-gray-900 antialiased" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
