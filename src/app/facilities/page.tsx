import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function FacilitiesPage() {
  const facilities = [
    {
      title: "State-of-the-Art Consultation Rooms",
      seoDesc: "Haya Wellness Centre, widely recognized as a Top Hospital in Srinagar, offers private, acoustically treated consultation rooms. Our environment is carefully designed to ensure absolute confidentiality and comfort, ensuring that our expert doctors can focus entirely on providing you with the best medical care and diagnostics in the Kashmir Valley.",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Advanced Diagnostics & Imaging Center",
      seoDesc: "When looking for the best diagnostic center in Srinagar, Haya Wellness stands unmatched. Equipped with cutting-edge technology for precise and rapid testing, our advanced imaging and laboratory facilities ensure accurate results. From cardiology to internal medicine, our diagnostics form the backbone of our highly rated medical treatments.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Specialized Treatment & Care Areas",
      seoDesc: "As a leading healthcare provider and the best clinic in Srinagar, we prioritize patient safety above all. Our modern, strictly sanitized treatment zones are perfectly equipped for minor procedures and specialized care. Whether you are consulting for cardiology, pediatrics, or general medicine, our treatment areas meet the highest global hygiene standards.",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Serene Patient Waiting & Recovery Lounge",
      seoDesc: "Healing begins the moment you step into Haya Wellness. Ranked as the top medical facility in Srinagar for patient experience, our waiting areas feature natural light, comfortable seating, and a serene atmosphere to reduce pre-appointment anxiety. We believe that a calming environment is crucial for complete recovery and holistic wellness.",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <main className="flex flex-col w-full pb-24 bg-white">
      <section className="relative w-full bg-emerald-deep py-20 md:py-32 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">World-Class Facilities at the Top Hospital in Srinagar</h1>
          <p className="text-lg md:text-xl text-emerald-soft leading-relaxed max-w-3xl mx-auto">
            Haya Wellness Centre combines state-of-the-art medical technology with a compassionate healing environment. Discover why we are the most trusted medical facility for cardiology, specialized care, and advanced diagnostics in the region.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 md:py-24">
        <div className="space-y-20 md:space-y-32">
          {facilities.map((fac, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 md:gap-16 items-center`}>
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-2xl">
                  <Image 
                    src={fac.image} 
                    alt={fac.title} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 border border-white/20 rounded-[2rem] pointer-events-none"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 text-emerald-teal font-bold tracking-wider uppercase text-sm mb-2">
                  <CheckCircle2 className="w-5 h-5" /> Excellence in Care
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-emerald-deep leading-tight">
                  {fac.title}
                </h2>
                <div className="h-1 w-20 bg-gold-subtle rounded-full"></div>
                <p className="text-lg text-text-muted leading-relaxed">
                  {fac.seoDesc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 lg:px-8 py-16 text-center">
        <div className="bg-ivory-warm rounded-[3rem] p-12 md:p-20 shadow-lg border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-serif text-emerald-deep mb-6">Experience the Best Healthcare in Srinagar</h2>
          <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
            From top-tier cardiology treatments to expert pediatric and general care, Haya Wellness is committed to your complete recovery and well-being.
          </p>
          <Link 
            href="/appointment"
            className="inline-flex items-center gap-3 bg-emerald-teal text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-emerald-deep transition-all shadow-xl hover:-translate-y-1"
          >
            Book an Appointment <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
