"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Calendar, Users, Grid, Stethoscope, FileText, Image as ImageIcon, Settings, LogOut } from "lucide-react";
import clsx from "clsx";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Doctors", href: "/admin/doctors", icon: Users },
    { name: "Departments", href: "/admin/departments", icon: Grid },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-deep text-white flex flex-col shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/10 gap-3">
          <div className="relative w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center text-emerald-deep font-bold font-serif">
            H
          </div>
          <span className="font-serif text-lg tracking-wide">Admin Portal</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
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
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-semibold text-emerald-deep">
            {navItems.find(i => pathname.startsWith(i.href))?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-soft text-emerald-teal flex items-center justify-center font-bold">
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
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
