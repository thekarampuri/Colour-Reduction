import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colour Reduction",
  description: "Advanced Colour Reduction Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="./legacyLogic.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
