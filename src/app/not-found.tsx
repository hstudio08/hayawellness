import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-serif text-emerald-deep mb-4">404</h1>
      <h2 className="text-2xl font-serif text-emerald-deep mb-4">Page Not Found</h2>
      <p className="text-text-muted mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/"
        className="bg-emerald-deep text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-teal transition-colors flex items-center gap-2 group"
      >
        Return Home
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
