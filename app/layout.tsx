import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Md Tufail | Developer Portfolio",
  description: "Premium modern developer portfolio for Md Tufail.",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.className}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
