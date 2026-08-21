import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="relative w-full bg-emerald-deep text-white py-24 md:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop" 
            alt="Hospital interior" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">About Haya Wellness</h1>
          <p className="text-lg md:text-xl text-emerald-soft/90 leading-relaxed">
            Redefining the modern clinical experience through medical excellence, architectural serenity, and a deeply human approach to care.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-sm font-semibold text-emerald-teal uppercase tracking-widest mb-4 block">Our Approach</span>
            <h2 className="text-3xl md:text-4xl font-serif text-emerald-deep mb-6">Care that focuses on you, not just the condition.</h2>
            <p className="text-text-muted mb-6 leading-relaxed text-lg">
              At Haya Wellness Centre, we believe that effective healthcare requires more than just advanced medical equipment. It requires an environment that reduces anxiety, doctors who listen, and a system designed entirely around the patient.
            </p>
            <ul className="space-y-4 mt-8">
              {[
                "Highly specialized medical team",
                "State-of-the-art diagnostic technology",
                "Patient-first scheduling and support",
                "Restorative, calming environment"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-text-dark font-medium">
                  <CheckCircle2 className="w-6 h-6 text-emerald-teal shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-square md:aspect-video lg:aspect-square relative rounded-[2.5rem] overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop" 
              alt="Medical professionals" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="bg-ivory-warm py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-emerald-teal uppercase tracking-widest mb-4 block">World-Class Infrastructure</span>
            <h2 className="text-3xl md:text-5xl font-serif text-emerald-deep mb-6">Our Facilities</h2>
            <p className="text-text-muted text-lg leading-relaxed">
              We have designed every inch of Haya Wellness to promote healing and provide the highest standard of modern medical care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Advanced Imaging Center",
                desc: "Equipped with latest MRI and CT scanners for rapid, precise diagnostics.",
                img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"
              },
              {
                name: "Surgical Suites",
                desc: "Ultra-sterile environments with cutting-edge robotic surgical assistance systems.",
                img: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop"
              },
              {
                name: "Recovery Lounges",
                desc: "Private, serene recovery rooms designed like luxury suites to lower patient anxiety.",
                img: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?q=80&w=800&auto=format&fit=crop"
              }
            ].map((fac, i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-emerald-deep/5 border border-gray-100 group">
                <div className="relative h-64 overflow-hidden">
                  <Image src={fac.img} alt={fac.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-serif text-emerald-deep mb-3">{fac.name}</h3>
                  <p className="text-text-muted">{fac.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-serif text-emerald-deep mb-6">Experience the difference.</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/doctors" className="bg-emerald-deep text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-emerald-teal transition-colors">
            Meet Our Doctors
          </Link>
          <Link href="/appointment" className="bg-white text-emerald-deep border border-emerald-teal/30 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-emerald-soft transition-colors">
            Book Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
