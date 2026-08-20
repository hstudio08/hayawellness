import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

export default function ServicesPage() {
  return (
    <main className="flex flex-col w-full pb-24">
      <section className="bg-emerald-deep text-white py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Services</h1>
        <p className="text-emerald-soft/80 max-w-2xl mx-auto">
          Comprehensive medical services designed to support your health journey from diagnosis to recovery.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full">
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <Image 
                  src={service.image} 
                  alt={service.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-serif text-emerald-deep mb-3">{service.name}</h3>
                <p className="text-text-muted mb-6 flex-1">{service.description}</p>
                <div className="flex items-center gap-2 text-emerald-teal font-semibold group-hover:text-emerald-deep transition-colors">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
