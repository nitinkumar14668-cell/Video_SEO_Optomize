import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video SEO Optimizer",
  description: "Analyze and fix YouTube Video SEO issues with one click using Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
