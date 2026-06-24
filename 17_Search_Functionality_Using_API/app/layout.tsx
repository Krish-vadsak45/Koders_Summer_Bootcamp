import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Search - Google Books API",
  description: "Search for books using the Google Books API with pagination, search history, and detailed views",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen">
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book Search</h1>
          <ThemeToggle />
        </header>
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
