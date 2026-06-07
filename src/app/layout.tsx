import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "📌 Pinboard — tarat & margo",
  description: "An infinite canvas for links, ideas, and things to explore",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          color: "#1d1d1f",
          background: "#fff",
        }}
      >
        {children}
      </body>
    </html>
  );
}
