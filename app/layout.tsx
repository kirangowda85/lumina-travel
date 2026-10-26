import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/nav/Footer";
import BottomNav from "@/components/nav/BottomNav";
import "./globals.css";

// Headings: serif display face (Section 2 of the build plan)
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

// Body/UI: sans-serif
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Payana (ಪಯಣ) | Curated Luxury Journeys",
    template: "%s | Payana (ಪಯಣ)",
  },
  description: "ಪ್ರತಿಯೊಂದು ಹೆಜ್ಜೆ ... ಒಂದು ಕಥೆ... Reserve your journey with Payana's curated destination packages.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0B1F3A",
          colorText: "#0B1F3A",
          colorTextSecondary: "#6B7280",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#EEF2F7",
          borderRadius: "1rem",
        },
      }}
    >
      <html lang="en">
        <body className={`${display.variable} ${body.variable} font-sans bg-page text-navy antialiased`}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
