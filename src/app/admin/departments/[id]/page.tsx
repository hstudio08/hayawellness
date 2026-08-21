"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getDepartments, addDepartment, updateDepartment, Department } from "@/firebase/db";
import { ArrowLeft, X, ListPlus } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
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

export default function DepartmentFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const isCreate = id === "create";

  const [loading, setLoading] = useState(true);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  
  const [formData, setFormData] = useState<Partial<Department>>({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    icon: "FaStethoscope",
    services: [],
    conditions: [],
    isActive: true,
  });

  const [serviceInput, setServiceInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [wordCountError, setWordCountError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setAllDepartments(data);
      
      if (!isCreate) {
        const dept = data.find(d => d.id === id);
        if (dept) setFormData(dept);
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

  const handleShortDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length > 10) {
      setWordCountError("Short description must be 10 words or less");
    } else {
      setWordCountError("");
    }
    setFormData({ ...formData, shortDescription: text });
  };

  const addService = () => {
    if (serviceInput.trim() && !formData.services?.includes(serviceInput.trim())) {
      setFormData({ ...formData, services: [...(formData.services || []), serviceInput.trim()] });
      setServiceInput("");
    }
  };

  const removeService = (index: number) => {
    const newArr = [...(formData.services || [])];
    newArr.splice(index, 1);
    setFormData({ ...formData, services: newArr });
  };

  const addCondition = () => {
    if (conditionInput.trim() && !formData.conditions?.includes(conditionInput.trim())) {
      setFormData({ ...formData, conditions: [...(formData.conditions || []), conditionInput.trim()] });
      setConditionInput("");
    }
  };

  const removeCondition = (index: number) => {
    const newArr = [...(formData.conditions || [])];
    newArr.splice(index, 1);
    setFormData({ ...formData, conditions: newArr });
  };

  const validateSlugUnique = (slug: string, currentId?: string) => {
    return !allDepartments.some(d => d.slug === slug && d.id !== currentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (wordCountError) {
      alert("Please fix validation errors before saving.");
      setSaving(false);
      return;
    }

    if (!formData.slug || !validateSlugUnique(formData.slug, !isCreate ? id : undefined)) {
      alert("Please provide a unique slug for the department URL.");
      setSaving(false);
      return;
    }

    try {
      if (isCreate) {
        await addDepartment(formData as Omit<Department, "id">);
      } else {
        await updateDepartment(id, formData);
      }
      router.push("/admin/departments");
    } catch (err) {
      console.error("Failed to save department", err);
      alert("Oops! We couldn't save the department details. Please try again.");
      setSaving(false);
    }
  };

  if (loading) return <div className="text-emerald-deep font-semibold p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/departments" className="p-2 text-text-muted hover:text-emerald-deep bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-fredoka text-emerald-deep mb-1">
            {isCreate ? 'Add New Department' : 'Edit Department'}
          </h1>
          <p className="text-sm text-text-muted font-sans">Enter the details below to manage the department profile.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <form id="dept-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-5">
              <h3 className="text-sm font-bold font-fredoka text-emerald-deep tracking-wider mb-2 border-b border-gray-50 pb-2">Basic Info</h3>
              
              <div>
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Department Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
                  placeholder="e.g. Cardiology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">URL Slug</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '')})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-gray-50 font-sans text-sm transition-all"
                  placeholder="e.g. cardiology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Icon Symbol</label>
                <select 
                  required
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all"
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-5 h-5 text-emerald-teal rounded border-gray-300 focus:ring-emerald-teal"
                />
                <label htmlFor="isActive" className="text-sm font-medium font-oswald text-emerald-deep tracking-wide">Department is Active & Visible</label>
              </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-5">
              <h3 className="text-sm font-bold font-fredoka text-emerald-deep tracking-wider mb-2 border-b border-gray-50 pb-2">Descriptions</h3>
              
              <div>
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Short Description (Max 10 words)</label>
                <input 
                  type="text" 
                  required
                  value={formData.shortDescription}
                  onChange={handleShortDescChange}
                  className={`w-full p-3 border rounded-xl font-sans text-sm transition-all focus:outline-none focus:ring-2 bg-white ${wordCountError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-emerald-teal focus:ring-emerald-teal/20'}`}
                  placeholder="One-line hook for the department..."
                />
                {wordCountError && <p className="text-xs text-red-500 mt-1 font-sans">{wordCountError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Full Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 bg-white font-sans text-sm transition-all resize-none"
                  placeholder="Detailed overview of the department..."
                />
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Image */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-sm font-bold font-fredoka text-emerald-deep tracking-wider mb-2 border-b border-gray-50 pb-2">Department Banner</h3>
              <div className="p-2">
                <ImageUpload 
                  value={formData.image || ""} 
                  onChange={(url) => setFormData({...formData, image: url})} 
                  label="Banner Image"
                  helpText="Auto-optimized via Cloudinary"
                />
              </div>
            </div>

            {/* Services & Conditions */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-5">
              <h3 className="text-sm font-bold font-fredoka text-emerald-deep tracking-wider mb-2 border-b border-gray-50 pb-2">Treatments & Services</h3>
              
              {/* Services */}
              <div>
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Provided Services</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 font-sans text-sm"
                    placeholder="e.g. Echocardiogram"
                  />
                  <button type="button" onClick={addService} className="bg-emerald-soft text-emerald-teal p-2 rounded-lg hover:bg-emerald-teal hover:text-white transition-colors">
                    <ListPlus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.services?.map((svc, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 font-sans text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                      {svc}
                      <button type="button" onClick={() => removeService(i)} className="hover:text-red-500 focus:outline-none">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div className="pt-4 border-t border-gray-50">
                <label className="block text-sm font-medium font-oswald text-emerald-deep mb-1 tracking-wide">Treated Conditions</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-2 focus:ring-emerald-teal/20 font-sans text-sm"
                    placeholder="e.g. Hypertension"
                  />
                  <button type="button" onClick={addCondition} className="bg-emerald-soft text-emerald-teal p-2 rounded-lg hover:bg-emerald-teal hover:text-white transition-colors">
                    <ListPlus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.conditions?.map((cond, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-deep font-sans text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                      {cond}
                      <button type="button" onClick={() => removeCondition(i)} className="hover:text-red-500 focus:outline-none">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Link 
            href="/admin/departments"
            className="px-6 py-2.5 text-sm font-medium font-oswald text-text-muted hover:bg-gray-50 rounded-xl transition-colors border border-gray-200 tracking-wide"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            form="dept-form"
            className="bg-emerald-deep text-white px-8 py-2.5 rounded-xl text-sm font-medium font-oswald hover:bg-emerald-teal transition-all shadow-sm hover:shadow tracking-wide disabled:opacity-50"
            disabled={!!wordCountError}
          >
            {isCreate ? 'Add Department' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
