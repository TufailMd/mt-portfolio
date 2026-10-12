import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

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

      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Toaster/>
        <Footer />
      </body>
    </html>
  );
}
