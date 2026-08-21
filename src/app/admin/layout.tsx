"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Calendar, Users, Grid, Settings, LogOut, Menu, X } from "lucide-react";
import clsx from "clsx";
import { AuthProvider, useAuth } from "@/context/AuthContext";


import { Fredoka, Oswald } from "next/font/google";

const fredoka = Fredoka({ 
  subsets: ["latin"],
  variable: "--font-fredoka" 
});

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: "--font-oswald" 
});

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-emerald-deep font-semibold tracking-wider uppercase">Loading...</div>;
  }


  if (!user && !isLoginPage) {
    router.replace("/admin/login");
    return null;
  }

  if (user && isLoginPage) {
    router.replace("/admin/dashboard");
    return null;
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-ivory-warm">{children}</div>;
  }

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Patients", href: "/admin/patients", icon: Users },
    { name: "Doctors", href: "/admin/doctors", icon: Users },
    { name: "Departments", href: "/admin/departments", icon: Grid },
  ];

  return (
    <div className={`flex h-screen bg-gray-50 overflow-hidden font-sans ${fredoka.variable} ${oswald.variable}`}>
      {/* Sidebar */}
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-emerald-deep/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-emerald-deep text-white flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="absolute top-6 right-4 p-2 text-white/70 hover:text-white md:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
          <div className="relative w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center text-emerald-deep font-bold font-fredoka">
            H
          </div>
          <span className="font-fredoka text-lg tracking-wide">Admin Portal</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium font-oswald",
                  isActive ? "bg-emerald-teal text-white" : "text-emerald-soft/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-soft/70 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium mb-1">
            <Settings className="w-5 h-5" />
            Website Home
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-emerald-deep hover:bg-emerald-soft/50 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg md:text-xl font-semibold font-fredoka text-emerald-deep truncate max-w-[150px] sm:max-w-none">
              {navItems.find(i => pathname.startsWith(i.href))?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-soft text-emerald-teal flex items-center justify-center font-bold">
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
