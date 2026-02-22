import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HariHar (हरिहर) – Indian AI Assistant",
  description:
    "Multilingual Indian AI assistant powered by BharatGen Param-1. Supports Hindi, English, Hinglish and other Indic languages.",
  keywords: ["HariHar", "BharatGen", "Indian AI", "Hindi AI", "Param-1", "Multilingual AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
