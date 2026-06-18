import type { Metadata } from 'next';
import { CssBaseline } from '@mui/material';
import './globals.css';

export const metadata: Metadata = {
  title: 'React Simple Image Slider',
  description: 'Simple image slider component for React with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
