"use client";

import { useState, useEffect } from "react";
import { getDepartments, addDepartment, updateDepartment, deleteDepartment, Department } from "@/firebase/db";
import { Pencil, Trash2, Plus, X, ListPlus } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { IconRenderer } from "@/components/ui/IconRenderer";

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

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  
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
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug if not editing or if we want to allow live updates
    if (!editingDept) {
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

  const openModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData(dept);
    } else {
      setEditingDept(null);
      setFormData({
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
    }
    setWordCountError("");
    setServiceInput("");
    setConditionInput("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  const validateSlugUnique = (slug: string, currentId?: string) => {
    return !departments.some(d => d.slug === slug && d.id !== currentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (wordCountError) {
      alert("Please fix validation errors before saving.");
      return;
    }

    if (!formData.slug || !validateSlugUnique(formData.slug, editingDept?.id)) {
      alert("Error: URL Slug must be unique. Please change the slug.");
      return;
    }

    try {
      if (editingDept && editingDept.id) {
        await updateDepartment(editingDept.id, formData);
      } else {
        await addDepartment(formData as Omit<Department, "id">);
      }
      closeModal();
      fetchDepartments();
    } catch (err) {
      console.error("Failed to save department", err);
      alert("Failed to save department");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        fetchDepartments();
      } catch (err) {
        console.error("Failed to delete", err);
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
    }
  };

  if (loading) return <div className="text-emerald-deep font-semibold">Loading departments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-emerald-deep mb-1">Medical Departments</h1>
          <p className="text-sm text-text-muted">Manage your hospital's departments and specialties.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-emerald-deep text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-teal transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Icon</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
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
                      <p className="text-sm font-medium text-emerald-deep">{dept.name}</p>
                      <p className="text-xs text-text-muted">/{dept.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <IconRenderer name={dept.icon} className="w-4 h-4 text-emerald-teal" />
                    {ICON_OPTIONS.find(o => o.value === dept.icon)?.label || dept.icon}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => toggleActive(dept)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      dept.isActive ? 'bg-emerald-soft text-emerald-teal hover:bg-emerald-teal/20' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openModal(dept)} className="p-2 text-text-muted hover:text-emerald-teal bg-gray-50 hover:bg-emerald-soft rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => dept.id && handleDelete(dept.id)} className="p-2 text-text-muted hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-text-muted">No departments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-deep/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-serif text-emerald-deep">{editingDept ? 'Edit Department' : 'Add New Department'}</h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-emerald-deep hover:bg-gray-50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              <form id="dept-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-deep uppercase tracking-wider mb-2 border-b border-gray-50 pb-2">Basic Info</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-emerald-deep mb-1">Department Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={handleNameChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
                        placeholder="e.g. Cardiology"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-deep mb-1">URL Slug</label>
                      <input 
                        type="text" 
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '')})}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-gray-50"
                        placeholder="e.g. cardiology"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-deep mb-1">Icon Symbol</label>
                      <select 
                        required
                        value={formData.icon}
                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
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
                        className="w-4 h-4 text-emerald-teal rounded border-gray-300 focus:ring-emerald-teal"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-emerald-deep">Department is Active & Visible</label>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-deep uppercase tracking-wider mb-2 border-b border-gray-50 pb-2">Descriptions</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-emerald-deep mb-1">Short Description (Max 10 words)</label>
                      <input 
                        type="text" 
                        required
                        value={formData.shortDescription}
                        onChange={handleShortDescChange}
                        className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 bg-white ${wordCountError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-emerald-teal focus:ring-emerald-teal'}`}
                        placeholder="One-line hook for the department..."
                      />
                      {wordCountError && <p className="text-xs text-red-500 mt-1">{wordCountError}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-deep mb-1">Full Description</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white resize-none"
                        placeholder="Detailed overview of the department..."
                      />
                    </div>
                  </div>

                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  
                  {/* Image */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-deep uppercase tracking-wider mb-2 border-b border-gray-50 pb-2">Department Banner</h3>
                    <ImageUpload 
                      value={formData.image || ""} 
                      onChange={(url) => setFormData({...formData, image: url})} 
                      label="Banner Image"
                      helpText="Auto-optimized via Cloudinary"
                    />
                  </div>

                  {/* Services & Conditions */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-deep uppercase tracking-wider mb-2 border-b border-gray-50 pb-2">Treatments & Services</h3>
                    
                    {/* Services */}
                    <div>
                      <label className="block text-sm font-medium text-emerald-deep mb-1">Provided Services</label>
                      <div className="flex gap-2 mb-3">
                        <input 
                          type="text" 
                          value={serviceInput}
                          onChange={(e) => setServiceInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                          className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal"
                          placeholder="e.g. Echocardiogram"
                        />
                        <button type="button" onClick={addService} className="bg-emerald-soft text-emerald-teal p-2 rounded-lg hover:bg-emerald-teal hover:text-white transition-colors">
                          <ListPlus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.services?.map((svc, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                            {svc}
                            <button type="button" onClick={() => removeService(i)} className="hover:text-red-500 focus:outline-none">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="pt-2 border-t border-gray-50">
                      <label className="block text-sm font-medium text-emerald-deep mb-1">Treated Conditions</label>
                      <div className="flex gap-2 mb-3">
                        <input 
                          type="text" 
                          value={conditionInput}
                          onChange={(e) => setConditionInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                          className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal"
                          placeholder="e.g. Hypertension"
                        />
                        <button type="button" onClick={addCondition} className="bg-emerald-soft text-emerald-teal p-2 rounded-lg hover:bg-emerald-teal hover:text-white transition-colors">
                          <ListPlus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.conditions?.map((cond, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-deep text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
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
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="dept-form"
                className="bg-emerald-deep text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-teal transition-colors disabled:opacity-50"
                disabled={!!wordCountError}
              >
                {editingDept ? 'Save Changes' : 'Add Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
