import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant-garamond" 
});

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "Haya Wellness Centre - Top Rated Medical Facility",
  description: "Haya Wellness Centre is a top-rated hospital providing expert medical care and advanced treatments across multiple departments. Trusted Care, Complete Recovery.",
  keywords: "Haya Wellness, Hospital, Medical Centre, Doctors, Clinic, Top Rated Hospital",
};

import ClientLayout from "@/components/layout/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-ivory-warm font-sans text-text-dark flex flex-col">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
