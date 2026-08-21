"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Search, X, User as UserIcon, Calendar, ArrowRight } from "lucide-react";
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
    { name: "Insights", href: "/health" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50">
        <div className="bg-white/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(4,114,77,0.06)] rounded-b-[2rem] sm:rounded-b-[2.5rem] h-[5rem] sm:h-[5.5rem] w-full border-b border-white/50 transition-all">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full shadow-sm">
                <Image 
                  src="/logo.png" 
                  alt="Haya Wellness Centre" 
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-xl sm:text-2xl text-emerald-deep tracking-tight group-hover:text-emerald-teal transition-colors whitespace-nowrap">
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
                      isActive ? "text-emerald-teal font-bold" : "text-text-muted font-medium hover:text-emerald-deep"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link
                href="/patient"
                className="hidden md:flex items-center gap-2 text-sm font-oswald uppercase tracking-wider text-emerald-teal hover:text-emerald-deep transition-colors px-4 py-2 bg-emerald-soft/50 rounded-xl hover:bg-emerald-soft border border-emerald-teal/10"
              >
                <UserIcon className="w-4 h-4" /> Portal
              </Link>
              
              <Link 
                href="/appointment" 
                className="hidden md:flex bg-emerald-deep hover:bg-emerald-teal text-white px-7 py-3 rounded-full text-[13px] font-bold tracking-wide uppercase transition-all shadow-md items-center justify-center whitespace-nowrap hover:shadow-xl hover:-translate-y-0.5"
              >
                Book Appointment
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2.5 text-emerald-deep bg-emerald-soft/50 border border-emerald-teal/10 rounded-xl hover:bg-emerald-soft transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Floating Card Design */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] p-4 flex flex-col justify-start items-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/40 animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Floating Card */}
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-4 duration-300 mt-2">
            
            {/* Top Bar inside the modal */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 shrink-0">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                <div className="relative w-8 h-8 overflow-hidden rounded-full shadow-sm">
                  <Image src="/logo.png" alt="Haya" fill sizes="32px" className="object-cover" />
                </div>
              </Link>
              
              <div className="flex items-center gap-3">
                <Link 
                  href="/appointment" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-emerald-teal text-white px-5 py-2 rounded-full font-oswald uppercase tracking-wider text-xs hover:bg-emerald-deep transition-colors"
                >
                  Book
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Links Content */}
            <div className="px-6 py-6 flex flex-col gap-2">
              <Link 
                href="/patient" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl font-oswald uppercase tracking-wider text-sm font-semibold text-emerald-deep hover:bg-gray-50 transition-colors"
              >
                Patient Portal
              </Link>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "py-3 px-4 rounded-xl font-oswald uppercase tracking-wider text-sm font-semibold transition-colors",
                      isActive 
                        ? "text-emerald-teal bg-emerald-soft/30" 
                        : "text-gray-800 hover:bg-gray-50"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
