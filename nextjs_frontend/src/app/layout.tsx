"use client"; // Ensure this runs on the client side

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Stock Visualizer Dashboard",
  description: "A dashboard for visualizing stock data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Ensure this runs only after the component is mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Render ThemeProvider only after the component is mounted */}
        {mounted ? (
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
