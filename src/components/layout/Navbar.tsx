"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Departments", href: "/departments" },
    { name: "Doctors", href: "/doctors" },
    { name: "Facilities", href: "/facilities" },
    { name: "Insights", href: "/health" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50">
        <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-b-[2.5rem] h-[5.5rem] w-full border-b border-white/50 transition-all">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-12 h-12 overflow-hidden rounded-full shadow-sm">
                <Image 
                  src="/logo.png" 
                  alt="Haya Wellness Centre" 
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-2xl text-emerald-deep tracking-tight group-hover:text-emerald-teal transition-colors whitespace-nowrap">
                Haya Wellness
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={clsx(
                      "text-[15px] transition-all whitespace-nowrap hover:-translate-y-0.5",
                      isActive ? "text-emerald-deep font-bold" : "text-text-muted font-semibold hover:text-emerald-deep"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-5 shrink-0">
              <a href="tel:7889" className="hidden xl:flex flex-col text-right mr-2 hover:opacity-80 transition-opacity">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">Urgent Care</span>
                <span className="text-base font-bold text-emerald-deep leading-none">7889XXXXX</span>
              </a>
              
              <Link 
                href="/appointment" 
                className="hidden md:flex bg-emerald-deep hover:bg-emerald-teal text-white px-7 py-3.5 rounded-full text-[13px] font-bold tracking-wide uppercase transition-all shadow-md items-center justify-center whitespace-nowrap hover:shadow-xl hover:-translate-y-1"
              >
                Book Appointment
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-3 text-emerald-deep bg-emerald-soft/50 rounded-2xl hover:bg-emerald-soft transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col overflow-hidden animate-in fade-in duration-200">
          <div className="h-20 px-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 overflow-hidden rounded-full">
                <Image src="/logo.png" alt="Haya" fill sizes="32px" className="object-cover" />
              </div>
              <span className="font-serif text-lg text-emerald-deep">Haya Wellness</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-text-muted hover:text-emerald-deep"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "text-xl font-medium",
                      isActive ? "text-emerald-deep font-bold" : "text-text-dark"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
              <Link 
                href="/appointment" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-emerald-deep text-white text-center py-4 rounded-xl font-semibold text-lg"
              >
                Book an Appointment
              </Link>
              <Link 
                href="/doctors" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-emerald-soft text-emerald-deep text-center py-4 rounded-xl font-semibold text-lg"
              >
                Find a Doctor
              </Link>
            </div>
            
            <div className="mt-8 flex flex-col gap-2 text-center">
              <span className="text-sm font-medium text-text-muted uppercase">Urgent Help</span>
              <a href="tel:7889" className="text-xl font-bold text-emerald-deep hover:text-emerald-teal transition-colors">7889XXXXX</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
