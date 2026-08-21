"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MessageCircle, Phone } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      <div className="flex-1 pt-20 print:pt-0">
        {children}
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
      
      {/* Floating Action Buttons */}
      <a 
        href="https://wa.me/917889000000" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center group print:hidden"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute left-14 bg-white text-gray-800 text-sm font-semibold px-3 py-1.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </a>

      <a 
        href="tel:7889"
        className="fixed bottom-6 right-6 z-50 bg-emerald-teal text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center group print:hidden"
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute right-14 bg-white text-gray-800 text-sm font-semibold px-3 py-1.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Call Now
        </span>
      </a>
    </>
  );
}
