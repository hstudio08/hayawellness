"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDoctors, getDepartments, Doctor, Department } from "@/firebase/db";
import { Search } from "lucide-react";

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [docs, depts] = await Promise.all([getDoctors(), getDepartments()]);
      setDoctors(docs.filter(d => d.isActive));
      setDepartments(depts.filter(d => d.isActive));
      setLoading(false);
    }
    fetchData();
  }, []);

  const getDeptName = (deptId: string) => {
    return departments.find(d => d.slug === deptId)?.name || deptId;
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || doc.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return (
      <main className="flex flex-col w-full min-h-screen items-center justify-center">
        <p className="text-emerald-deep font-semibold">Loading Doctors...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full pb-24">
      <section className="bg-ivory-warm py-12 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-serif text-emerald-deep mb-4 md:mb-6">Our Doctors</h1>
          <p className="text-base md:text-lg text-text-muted">
            Meet our team of experienced specialists dedicated to providing you with the highest standard of care.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12 w-full">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by doctor name..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal focus:border-transparent text-sm md:text-base shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal bg-white min-w-[240px] text-sm md:text-base shadow-sm"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.slug}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 w-full">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col group hover:-translate-y-1">
                <div className="relative aspect-square w-full bg-emerald-soft/20 overflow-hidden">
                  <Image 
                    src={doctor.photo || 'https://via.placeholder.com/400'} 
                    alt={doctor.name} 
                    fill 
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-emerald-deep shadow-md">
                    {getDeptName(doctor.departmentId)}
                  </div>
                </div>
                <div className="p-5 md:p-8 flex flex-col flex-1 bg-white">
                  <h3 className="text-lg md:text-2xl font-serif text-emerald-deep mb-2 line-clamp-1 group-hover:text-emerald-teal transition-colors">{doctor.name}</h3>
                  <p className="text-xs md:text-sm font-semibold text-emerald-teal/80 mb-6 line-clamp-1 uppercase tracking-wider">{doctor.specialization || getDeptName(doctor.departmentId)}</p>
                  
                  <div className="flex flex-col xl:flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
                    <Link 
                      href={`/doctors/${doctor.slug}`}
                      className="flex-1 text-center py-3 rounded-xl border border-emerald-teal/30 text-emerald-deep font-bold text-xs md:text-sm hover:bg-emerald-soft hover:border-emerald-teal/50 transition-all"
                    >
                      View Profile
                    </Link>
                    <Link 
                      href={`/appointment?doctor=${doctor.id}`}
                      className="flex-1 text-center py-3 rounded-xl bg-emerald-teal text-white font-bold text-xs md:text-sm hover:bg-emerald-deep transition-all shadow-md hover:shadow-lg"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-serif text-emerald-deep mb-2">No doctors found</h3>
            <p className="text-text-muted">Try adjusting your search criteria.</p>
          </div>
        )}
      </section>
    </main>
  );
}
