import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description:
    "A responsive BMI calculator with unit conversion, category guidance, healthy weight range, and saved recent results.",
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
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
