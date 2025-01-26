import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bank Account Creation For Growth Sttafs",
  description: "Bank Account Creation For Growth Sttafs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        <footer className="bg-gray-800 text-white py-8 fixed bottom-0 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between">
              <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Tugza Bank</h3>
                <p className="text-gray-400">
                  TUGZA Innovations for potentially enhanced future!
                </p>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-400">
              <p>&copy; 2025 Tugza Bank. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
