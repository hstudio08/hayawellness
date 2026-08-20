import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "@/data/mockData";

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find(s => s.slug === params.slug);
  
  if (!service) {
    notFound();
  }

  return (
    <main className="flex flex-col w-full pb-24">
      <section className="bg-ivory-warm py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <Link href="/services" className="text-sm font-semibold text-emerald-teal uppercase tracking-widest mb-4 hover:underline">
            ← Back to Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-deep my-6">{service.name}</h1>
          <p className="text-lg text-text-muted">{service.description}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-16">
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl mb-12">
          <Image src={service.image} alt={service.name} fill className="object-cover" />
        </div>
        
        <div className="prose prose-lg max-w-none text-text-dark">
          <h2 className="text-2xl font-serif text-emerald-deep">About this Service</h2>
          <p>
            Our {service.name.toLowerCase()} is designed with patient comfort and clinical accuracy in mind. 
            We utilize state-of-the-art technology and follow evidence-based protocols to ensure the best possible outcomes.
          </p>
          <p>
            Please contact our center for detailed information regarding preparation, duration, and what to expect during your visit.
          </p>
        </div>

        <div className="mt-12 text-center bg-emerald-soft p-8 rounded-3xl">
          <h3 className="text-xl font-serif text-emerald-deep mb-4">Ready to schedule?</h3>
          <Link 
            href="/appointment"
            className="inline-block bg-emerald-deep text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-teal transition-colors"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
