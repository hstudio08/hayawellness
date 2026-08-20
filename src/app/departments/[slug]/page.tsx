"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getDepartments, getDoctors, Department, Doctor } from "@/firebase/db";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { IconRenderer } from "@/components/ui/IconRenderer";

export default function DepartmentProfile() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [deptDoctors, setDeptDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      const [depts, docs] = await Promise.all([getDepartments(), getDoctors()]);
      const foundDept = depts.find(d => d.slug === slug && d.isActive);
      
      if (!foundDept) {
        router.push('/departments');
        return;
      }
      
      const relatedDocs = docs.filter(d => d.departmentId === foundDept.slug && d.isActive);
      
      setDepartment(foundDept);
      setDeptDoctors(relatedDocs);
      setLoading(false);
    }
    fetchData();
  }, [slug, router]);

  if (loading) {
    return (
      <main className="flex flex-col w-full min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-teal border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-deep font-semibold">Loading Department...</p>
      </main>
    );
  }

  if (!department) return null;

  return (
    <main className="flex flex-col w-full pb-24">
      {/* Banner */}
      <section className="relative w-full h-[40vh] md:h-[50vh] bg-emerald-deep flex items-center justify-center overflow-hidden">
        {department.image && (
          <Image src={department.image} alt={department.name} fill className="object-cover opacity-40 mix-blend-overlay" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-12">
          <Link href="/departments" className="absolute -top-12 md:-top-20 left-0 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> All Departments
          </Link>
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto mb-6 flex items-center justify-center text-gold-subtle border border-white/20">
            <IconRenderer name={department.icon} className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">{department.name}</h1>
          <p className="text-lg md:text-xl text-emerald-soft/90 max-w-2xl mx-auto">
            {department.shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-20 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Col - Info */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-serif text-emerald-deep mb-6">Overview</h2>
            <div className="text-text-muted leading-relaxed space-y-4 whitespace-pre-wrap text-lg">
              {department.description}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Services */}
            <div className="bg-emerald-soft/30 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-emerald-deep mb-6">Services & Treatments</h3>
              {department.services && department.services.length > 0 ? (
                <ul className="space-y-4">
                  {department.services.map((svc, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-muted">
                      <CheckCircle2 className="w-5 h-5 text-emerald-teal shrink-0 mt-0.5" />
                      {svc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-muted">No specific services listed.</p>
              )}
            </div>

            {/* Conditions */}
            <div className="bg-ivory-warm p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-emerald-deep mb-6">Conditions We Treat</h3>
              {department.conditions && department.conditions.length > 0 ? (
                <ul className="space-y-4">
                  {department.conditions.map((cond, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-muted">
                      <div className="w-2 h-2 rounded-full bg-gold-subtle shrink-0 mt-2"></div>
                      {cond}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-muted">No specific conditions listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col - Doctors */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-emerald-deep mb-6 pb-4 border-b border-gray-100">
              Our Specialists
            </h3>
            
            {deptDoctors.length > 0 ? (
              <div className="space-y-6">
                {deptDoctors.map(doc => (
                  <Link key={doc.id} href={`/doctors/${doc.slug}`} className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 relative bg-gray-100">
                      <Image src={doc.photo || 'https://via.placeholder.com/100'} alt={doc.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-deep group-hover:text-emerald-teal transition-colors">{doc.name}</h4>
                      <p className="text-xs text-text-muted line-clamp-1">{doc.specialization}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">No specialists assigned yet.</p>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/appointment" className="block w-full text-center bg-emerald-teal text-white font-bold py-3.5 rounded-full hover:bg-emerald-deep transition-all shadow-md">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
