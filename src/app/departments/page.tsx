"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getDepartments, Department } from "@/firebase/db";
import { ArrowRight } from "lucide-react";
import { IconRenderer } from "@/components/ui/IconRenderer";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const depts = await getDepartments();
      setDepartments(depts.filter(d => d.isActive));
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col w-full min-h-screen items-center justify-center">
        <p className="text-emerald-deep font-semibold">Loading Departments...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full pb-24">
      <section className="bg-emerald-deep text-white py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Medical Departments</h1>
        <p className="text-emerald-soft/80 max-w-2xl mx-auto px-4">
          Explore our specialized departments, equipped with advanced technology and staffed by expert medical professionals.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Link key={dept.id} href={`/departments/${dept.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full hover:-translate-y-1">
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {dept.image ? (
                  <Image 
                    src={dept.image} 
                    alt={dept.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-soft flex items-center justify-center text-emerald-teal/30">
                    <IconRenderer name={dept.icon} className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white p-2 rounded-xl shadow-sm group-hover:bg-emerald-teal group-hover:text-white transition-colors">
                  <IconRenderer name={dept.icon} className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-serif text-emerald-deep mb-2">{dept.name}</h3>
                <p className="text-text-muted text-sm line-clamp-2 mb-6 flex-1">{dept.shortDescription}</p>
                <div className="flex items-center text-emerald-teal font-semibold text-sm group-hover:gap-2 transition-all">
                  View Department <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
