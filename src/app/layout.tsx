import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Portfolio.ai — AI Portfolio Generator | Show, Don't Tell",
  description: "Turn your projects into powerful case studies in minutes with AI. Upload a PDF, paste a GitHub link, or describe your work — get a stunning portfolio page instantly.",
  keywords: ["portfolio", "AI", "case study", "resume", "proof of work", "career", "projects"],
  openGraph: {
    title: "Portfolio.ai — AI Portfolio Generator",
    description: "Turn your projects into powerful case studies in minutes with AI. Build a stunning proof-of-work portfolio.",
    type: "website",
    siteName: "Portfolio.ai",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio.ai — AI Portfolio Generator",
    description: "Turn your projects into powerful case studies in minutes with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
