"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let the layout's AuthGuard handle the redirect so it's smooth
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      setIsLoading(false);
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
            <label className="block text-sm font-semibold text-emerald-deep mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal"
              placeholder="admin@hayawellness.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-deep mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-deep text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-teal transition-colors mt-4 disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <p className="text-xs text-center text-text-muted mt-6">
          This is a restricted area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
