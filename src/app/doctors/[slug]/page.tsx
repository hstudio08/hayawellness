"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getDoctors, getDepartments, Doctor, Department } from "@/firebase/db";
import { ArrowLeft, Calendar, Stethoscope, Award, GraduationCap, Globe } from "lucide-react";
import { IconRenderer } from "@/components/ui/IconRenderer";

export default function DoctorProfile() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      const [docs, depts] = await Promise.all([getDoctors(), getDepartments()]);
      const foundDoctor = docs.find(d => d.slug === slug && d.isActive);
      
      if (!foundDoctor) {
        router.push('/doctors'); // redirect if not found
        return;
      }
      
      const foundDept = depts.find(d => d.slug === foundDoctor.departmentId);
      
      setDoctor(foundDoctor);
      setDepartment(foundDept || null);
      setLoading(false);
    }
    fetchData();
  }, [slug, router]);

  if (loading) {
    return (
      <main className="flex flex-col w-full min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-teal border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-deep font-semibold">Loading Profile...</p>
      </main>
    );
  }

  if (!doctor) return null;

  return (
    <main className="flex flex-col w-full pb-24">
      {/* Header Profile Section */}
      <section className="bg-ivory-warm py-12 md:py-20 border-b border-gray-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          
          {/* Back button */}
          <Link href="/doctors" className="absolute top-0 left-4 lg:left-8 flex items-center gap-2 text-text-muted hover:text-emerald-teal transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Doctors
          </Link>

          {/* Photo */}
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white shrink-0 mt-8 md:mt-0 relative">
            <Image src={doctor.photo || 'https://via.placeholder.com/400'} alt={doctor.name} fill className="object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left mt-4 md:mt-8">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-emerald-teal shadow-sm mb-4">
              {department ? (
                <>
                  <IconRenderer name={department.icon} className="w-4 h-4" />
                  {department.name}
                </>
              ) : (
                <>{doctor.departmentId}</>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif text-emerald-deep mb-2">{doctor.name}</h1>
            <p className="text-lg md:text-xl text-text-muted font-medium mb-6">{doctor.specialization || (department?.name)}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <div className="w-8 h-8 rounded-full bg-gold-subtle/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-gold-subtle" />
                </div>
                <span className="font-semibold text-emerald-deep">{doctor.experience}</span> Experience
              </div>
              
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <span className="font-semibold text-emerald-deep">{doctor.availability || 'Available'}</span>
              </div>
            </div>

            <Link href={`/appointment?doctor=${doctor.id}`} className="inline-block bg-emerald-teal text-white px-8 py-3.5 rounded-full font-bold hover:bg-emerald-deep transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Book an Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-20 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Col - Bio */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-serif text-emerald-deep mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-soft flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-emerald-teal" />
              </div>
              About {doctor.name}
            </h2>
            <div className="text-text-muted leading-relaxed space-y-4 whitespace-pre-wrap">
              {doctor.bio}
            </div>
          </div>
        </div>

        {/* Right Col - Qualifications */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-emerald-deep mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <GraduationCap className="w-5 h-5 text-emerald-teal" />
              Qualifications
            </h3>
            {doctor.qualifications && doctor.qualifications.length > 0 ? (
              <ul className="space-y-4">
                {doctor.qualifications.map((qual, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-muted text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-subtle mt-1.5 shrink-0"></div>
                    {qual}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No specific qualifications listed.</p>
            )}
          </div>

          <div className="bg-emerald-deep p-8 rounded-3xl shadow-lg text-white text-center">
            <h3 className="font-serif text-xl mb-3">Need Assistance?</h3>
            <p className="text-emerald-soft/80 text-sm mb-6">Our support team is here to help you book an appointment with {doctor.name}.</p>
            <Link href="/contact" className="block w-full bg-white text-emerald-deep font-bold py-3 rounded-full hover:bg-gold-subtle transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
