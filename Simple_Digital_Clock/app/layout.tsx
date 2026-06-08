import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Clock",
  description: "A clean digital clock built with Next.js and shadcn ui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
