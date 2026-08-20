"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(password)) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-emerald-deep/5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-emerald-deep/10 p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-emerald-soft mb-4 border-2 border-white shadow-sm">
            <Image src="/logo.png" alt="Haya" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-serif text-emerald-deep">Admin Portal</h1>
          <p className="text-text-muted text-sm mt-1">Sign in to manage Haya Wellness Centre</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-sm font-semibold text-emerald-deep mb-2">Access Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-emerald-deep text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-teal transition-colors mt-4 flex items-center justify-center"
          >
            Access Portal
          </button>
        </form>
        
        <p className="text-xs text-center text-text-muted mt-6">
          This is a restricted area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
