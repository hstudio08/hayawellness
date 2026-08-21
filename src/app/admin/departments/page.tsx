"use client";

import { useState, useEffect, useMemo } from "react";
import { getDepartments, deleteDepartment, updateDepartment, Department } from "@/firebase/db";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { IconRenderer } from "@/components/ui/IconRenderer";
import Link from "next/link";

const ICON_OPTIONS = [
  { label: "Stethoscope (General)", value: "FaStethoscope" },
  { label: "Heart (Cardiology)", value: "FaHeartPulse" },
  { label: "Brain (Neurology)", value: "FaBrain" },
  { label: "Bone (Orthopedics)", value: "FaBone" },
  { label: "Tooth (Dentistry)", value: "FaTooth" },
  { label: "Eye (Ophthalmology)", value: "FaEye" },
  { label: "Lungs (Pulmonology)", value: "FaLungs" },
  { label: "Baby (Pediatrics)", value: "FaBaby" },
  { label: "DNA (Genetics)", value: "FaDna" },
  { label: "Pills (Pharmacy)", value: "FaPills" },
  { label: "Syringe (Vaccination)", value: "FaSyringe" },
  { label: "Microscope (Lab)", value: "FaMicroscope" },
  { label: "Activity (Health)", value: "Activity" }
];

const SkeletonLoader = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-6">
      <div className="w-1/3 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
      <div className="w-1/4 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
    </div>
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl"></div>
  </div>
);

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
      alert("Oops! We couldn't load the departments. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        fetchDepartments();
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Oops! We couldn't delete the department. Please check your connection and try again.");
      }
    }
  };

  const toggleActive = async (dept: Department) => {
    if (!dept.id) return;
    try {
      await updateDepartment(dept.id, { isActive: !dept.isActive });
      fetchDepartments();
    } catch (err) {
      console.error("Failed to toggle status", err);
      alert("Oops! We couldn't update the status. Please try again.");
    }
  };

  const filteredDepartments = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return departments.filter(dept => 
      !q || 
      dept.name.toLowerCase().includes(q) || 
      dept.slug.toLowerCase().includes(q)
    );
  }, [departments, searchQuery]);

  if (loading) return <SkeletonLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-fredoka text-emerald-deep mb-1">Medical Departments</h1>
          <p className="text-sm text-text-muted font-sans">Manage your hospital's departments and specialties.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal"
            />
          </div>
          <Link 
            href="/admin/departments/create"
            className="bg-emerald-deep text-white px-4 py-2 rounded-lg text-sm font-medium font-oswald tracking-wide hover:bg-emerald-teal transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Department
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase">Department</th>
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase">Icon</th>
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase">Status</th>
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(dept => (
                <tr key={dept.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {dept.image ? (
                         <img src={dept.image} alt={dept.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                         <div className="w-10 h-10 rounded-lg bg-emerald-soft flex items-center justify-center text-emerald-teal">
                           <IconRenderer name={dept.icon} className="w-5 h-5" />
                         </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-emerald-deep font-sans">{dept.name}</p>
                        <p className="text-xs text-text-muted">/{dept.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-text-muted font-sans">
                      <IconRenderer name={dept.icon} className="w-4 h-4 text-emerald-teal" />
                      {ICON_OPTIONS.find(o => o.value === dept.icon)?.label || dept.icon}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => toggleActive(dept)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-oswald tracking-widest uppercase cursor-pointer transition-colors ${
                        dept.isActive ? 'bg-emerald-soft text-emerald-teal' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {dept.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/departments/${dept.id}`} className="p-2 text-text-muted hover:text-emerald-teal bg-gray-50 hover:bg-emerald-soft rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => dept.id && handleDelete(dept.id)} className="p-2 text-text-muted hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDepartments.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-muted font-sans">No departments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col p-3 gap-4 bg-gray-50/30">
          {filteredDepartments.map((dept, index, arr) => (
            <div key={dept.id} className={`flex flex-col gap-3 ${index !== arr.length - 1 ? 'border-b border-dotted border-gray-300 pb-4' : ''}`}>
              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-teal/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-soft/40 rounded-full blur-xl -mr-10 -mt-10"></div>
                
                <div className="flex items-center gap-3 relative z-10">
                  {dept.image ? (
                     <img src={dept.image} alt={dept.name} className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm" />
                  ) : (
                     <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-teal shadow-sm border border-emerald-teal/10">
                       <IconRenderer name={dept.icon} className="w-5 h-5" />
                     </div>
                  )}
                  <div className="flex-1">
                    <p className="text-base font-fredoka text-emerald-deep leading-tight">{dept.name}</p>
                    <p className="text-[11px] font-mono text-text-muted mt-0.5">/{dept.slug}</p>
                  </div>
                  <button 
                    onClick={() => toggleActive(dept)}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold font-oswald tracking-widest uppercase shadow-sm ${
                      dept.isActive ? 'bg-emerald-soft text-emerald-teal' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-text-muted bg-white/90 p-3 rounded-lg border border-white mt-4 shadow-sm font-sans relative z-10">
                  <div className="bg-emerald-soft p-1 rounded-md text-emerald-teal">
                    <IconRenderer name={dept.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium font-oswald tracking-wide">{ICON_OPTIONS.find(o => o.value === dept.icon)?.label || dept.icon}</span>
                </div>
                
                <div className="flex items-center gap-3 mt-1 relative z-10">
                  <Link href={`/admin/departments/${dept.id}`} className="flex-1 py-2 px-3 text-emerald-teal bg-white hover:bg-emerald-50 border border-emerald-teal/10 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs font-medium font-oswald tracking-wide">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button onClick={() => dept.id && handleDelete(dept.id)} className="flex-1 py-2 px-3 text-red-500 bg-white hover:bg-red-50 border border-red-50 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs font-medium font-oswald tracking-wide">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredDepartments.length === 0 && (
            <div className="py-10 text-center font-sans text-text-muted bg-white rounded-xl border border-gray-100">No departments found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
