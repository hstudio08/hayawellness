"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getDoctors, addDoctor, updateDoctor, Doctor, getDepartments, Department } from "@/firebase/db";
import { ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import Link from "next/link";

const getStartEndTime = (str: string = "") => {
  try {
    if (!str) return { s: '09:00', e: '17:00' };
    let parts = str.split('-');
    if (parts.length < 2) return { s: '09:00', e: '17:00' };
    
    const to24 = (t: string) => {
       t = t.trim();
       let partsT = t.split(' ');
       let time = partsT[0];
       let modifier = partsT[1];
       if(!modifier) return time;
       let [h, m] = time.split(':').map(Number);
       if (h === 12) h = modifier.toUpperCase() === 'PM' ? 12 : 0;
       else if (modifier.toUpperCase() === 'PM') h += 12;
       return `${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}`;
    };
    return { s: to24(parts[0]), e: to24(parts[1]) };
  } catch(e) {
    return { s: '09:00', e: '17:00' };
  }
};

export default function DoctorFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const isCreate = id === "create";
  
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  
  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: "",
    slug: "",
    departmentId: "",
    experience: "",
    bio: "",
    photo: "",
    isActive: true,
    specialization: "",
    qualifications: [],
    availability: "Available",
    slots: 10,
    timings: "10:00 AM - 02:00 PM",
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsData, deptsData] = await Promise.all([
        getDoctors(),
        getDepartments()
      ]);
      setAllDoctors(docsData);
      setDepartments(deptsData);
      
      if (!isCreate) {
        const doc = docsData.find(d => d.id === id);
        if (doc) setFormData(doc);
      }
    } catch (err) {
      console.error(err);
      alert("Oops! We couldn't load the necessary data.");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (isCreate) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData({ ...formData, name, slug });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const validateSlugUnique = (slug: string, currentId?: string) => {
    return !allDoctors.some(d => d.slug === slug && d.id !== currentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !validateSlugUnique(formData.slug, !isCreate ? id : undefined)) {
      alert("Error: URL Slug must be unique. Please change the slug.");
      return;
    }

    try {
      if (!isCreate) {
        await updateDoctor(id, formData as Omit<Doctor, "id">);
      } else {
        await addDoctor(formData as Omit<Doctor, "id">);
      }
      router.push("/admin/doctors");
    } catch (err) {
      console.error("Failed to save doctor", err);
      alert("Oops! We couldn't save the doctor details. Please try again.");
    }
  };

  if (loading) return <div className="text-emerald-deep font-semibold p-6">Loading...</div>;

  const { s: startTime, e: endTime } = getStartEndTime(formData.timings);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/doctors" className="p-2 text-text-muted hover:text-emerald-deep bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-fredoka text-emerald-deep mb-1">
            {isCreate ? 'Add New Doctor' : 'Edit Doctor'}
          </h1>
          <p className="text-sm text-text-muted font-sans">Enter the details below to manage the doctor profile.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <form id="doctor-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Doctor Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
                placeholder="e.g. Dr. Sarah Jenkins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">URL Slug (must be unique)</label>
              <input 
                type="text" 
                required
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '')})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
                placeholder="e.g. dr-sarah-jenkins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Department</label>
              <select 
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({...formData, departmentId: e.target.value, specialization: departments.find(d => d.slug === e.target.value)?.name || ""})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept.slug} value={dept.slug}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Max Daily Slots</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={formData.slots}
                  onChange={(e) => setFormData({...formData, slots: parseInt(e.target.value) || 10})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Shift Timings</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="time" 
                    required
                    value={startTime}
                    onChange={(e) => setFormData({...formData, timings: `${e.target.value} - ${endTime}`})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
                  />
                  <span className="text-gray-400 font-medium text-sm px-1">to</span>
                  <input 
                    type="time" 
                    required
                    value={endTime}
                    onChange={(e) => setFormData({...formData, timings: `${startTime} - ${e.target.value}`})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Years of Experience</label>
              <input 
                type="text" 
                required
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
                placeholder="e.g. 15+ Years"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="w-5 h-5 text-emerald-teal rounded border-gray-300 focus:ring-emerald-teal"
              />
              <label htmlFor="isActive" className="text-sm font-medium font-oswald text-emerald-deep tracking-wide">Doctor is Active & Visible</label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <ImageUpload 
                value={formData.photo || ""} 
                onChange={(url) => setFormData({...formData, photo: url})} 
                label="Profile Photo"
                helpText="Auto-optimized via Cloudinary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">About Section (Introduction & Details)</label>
              <textarea 
                required
                rows={8}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all resize-none"
                placeholder="Brief biography, special interests, etc..."
              />
            </div>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Link 
            href="/admin/doctors"
            className="px-6 py-2.5 text-sm font-medium font-oswald tracking-wide text-text-muted hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            form="doctor-form"
            className="bg-emerald-deep text-white px-8 py-2.5 rounded-xl text-sm font-medium font-oswald tracking-wide hover:bg-emerald-teal transition-all shadow-sm hover:shadow"
          >
            {isCreate ? 'Add Doctor' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
