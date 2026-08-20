import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-emerald-deep text-white py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-8 h-8 overflow-hidden rounded-full bg-white">
                <Image src="/logo.png" alt="Haya" fill sizes="32px" className="object-cover" />
              </div>
              <span className="font-serif text-xl tracking-tight">Haya Wellness</span>
            </div>
            <p className="text-sm text-emerald-soft/80 mb-6 leading-relaxed">
              Excellence in healthcare through architectural precision and medical authority. Expert care, close to home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-xs text-gold-subtle mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-emerald-soft/80 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/departments" className="text-sm text-emerald-soft/80 hover:text-white transition-colors">Departments</Link></li>
              <li><Link href="/services" className="text-sm text-emerald-soft/80 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/doctors" className="text-sm text-emerald-soft/80 hover:text-white transition-colors">Our Doctors</Link></li>
              <li><Link href="/facilities" className="text-sm text-emerald-soft/80 hover:text-white transition-colors">Facilities</Link></li>
              <li><Link href="/health" className="text-sm text-emerald-soft/80 hover:text-white transition-colors">Health & Insights</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-emerald-soft/80 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-xs text-gold-subtle mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <span className="block text-xs text-emerald-soft/60 mb-1">General Enquiries</span>
                <span className="text-sm text-white font-medium">7889XXXXX</span>
              </li>
              <li>
                <span className="block text-xs text-emerald-soft/60 mb-1">Emergency</span>
                <span className="text-sm text-white font-medium">7889XXXXX</span>
              </li>
              <li>
                <span className="block text-xs text-emerald-soft/60 mb-1">Email</span>
                <a href="mailto:xyz@gmail.com" className="text-sm text-white font-medium hover:text-gold-subtle transition-colors">
                  xyz@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-xs text-gold-subtle mb-6">Location</h4>
            <p className="text-sm text-emerald-soft/80 mb-4 leading-relaxed">
              Haya Wellness Centre<br />
              Demo Address, Demo City
            </p>
            <Link 
              href="/contact" 
              className="inline-block border border-emerald-teal/50 hover:border-gold-subtle text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors"
            >
              GET DIRECTIONS
            </Link>
          </div>
        </div>

        <div className="border-t border-emerald-teal/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-soft/60">
          <p>© {new Date().getFullYear()} Haya Wellness Centre. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
