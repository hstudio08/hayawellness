"use client";

import { useState, useEffect, useMemo } from "react";
import { getDoctors, addDoctor, updateDoctor, deleteDoctor, Doctor, getDepartments, Department } from "@/firebase/db";
import { Pencil, Trash2, Plus, X, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

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

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsData, deptsData] = await Promise.all([
        getDoctors(),
        getDepartments()
      ]);
      setDoctors(docsData);
      setDepartments(deptsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug if we are creating a new doctor (or if editing and user hasn't manually overridden it)
    if (!editingDoctor) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData({ ...formData, name, slug });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const openModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData(doctor);
    } else {
      setEditingDoctor(null);
      setFormData({
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
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  const validateSlugUnique = (slug: string, currentId?: string) => {
    return !doctors.some(d => d.slug === slug && d.id !== currentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug || !validateSlugUnique(formData.slug, editingDoctor?.id)) {
      alert("Error: URL Slug must be unique. Please change the slug.");
      return;
    }

    try {
      if (editingDoctor && editingDoctor.id) {
        await updateDoctor(editingDoctor.id, formData);
      } else {
        await addDoctor(formData as Omit<Doctor, "id">);
      }
      closeModal();
      fetchData();
    } catch (err) {
      console.error("Failed to save doctor", err);
      alert("Failed to save doctor");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctor(id);
        fetchData();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  const toggleActive = async (doctor: Doctor) => {
    if (!doctor.id) return;
    try {
      await updateDoctor(doctor.id, { isActive: !doctor.isActive });
      fetchData();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const getDeptName = (deptId: string) => {
    return departments.find(d => d.slug === deptId)?.name || deptId;
  };

  if (loading) return <div className="text-emerald-deep font-semibold">Loading doctors...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-emerald-deep mb-1">Doctors Management</h1>
          <p className="text-sm text-text-muted">Add, edit, or remove doctors.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-emerald-deep text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-teal transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Doctor</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Experience</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doc => (
              <tr key={doc.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src={doc.photo || 'https://via.placeholder.com/40'} alt={doc.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-emerald-deep">{doc.name}</p>
                      <p className="text-xs text-text-muted">/{doc.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-text-muted">{getDeptName(doc.departmentId)}</td>
                <td className="py-4 px-6 text-sm text-text-muted">{doc.experience}</td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => toggleActive(doc)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      doc.isActive ? 'bg-emerald-soft text-emerald-teal hover:bg-emerald-teal/20' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {doc.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openModal(doc)} className="p-2 text-text-muted hover:text-emerald-teal bg-gray-50 hover:bg-emerald-soft rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => doc.id && handleDelete(doc.id)} className="p-2 text-text-muted hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-muted">No doctors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-deep/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-serif text-emerald-deep">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-emerald-deep hover:bg-gray-50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              {(() => { const { s: startTime, e: endTime } = getStartEndTime(formData.timings); return (
              <form id="doctor-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-emerald-deep mb-1">Doctor Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={handleNameChange}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
                      placeholder="e.g. Dr. Sarah Jenkins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-deep mb-1">URL Slug (must be unique)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '')})}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
                      placeholder="e.g. dr-sarah-jenkins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-deep mb-1">Department</label>
                    <select 
                      required
                      value={formData.departmentId}
                      onChange={(e) => setFormData({...formData, departmentId: e.target.value, specialization: departments.find(d => d.slug === e.target.value)?.name || ""})}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
                    >
                      <option value="">Select a department</option>
                      {departments.map(dept => (
                        <option key={dept.slug} value={dept.slug}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-5">
                      <div>
                        <label className="block text-sm font-medium text-emerald-deep mb-1">Max Daily Slots</label>
                        <input 
                          type="number" 
                          required
                          min="1"
                          value={formData.slots}
                          onChange={(e) => setFormData({...formData, slots: parseInt(e.target.value) || 10})}
                          className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
                          placeholder="e.g. 10"
                        />
                      </div>
                      <div>
                        
                        <label className="block text-sm font-medium text-emerald-deep mb-1">Shift Timings</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="time" 
                            required
                            value={startTime}
                            onChange={(e) => setFormData({...formData, timings: `${e.target.value} - ${endTime}`})}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
                          />
                          <span className="text-gray-400 font-medium text-sm px-1">to</span>
                          <input 
                            type="time" 
                            required
                            value={endTime}
                            onChange={(e) => setFormData({...formData, timings: `${startTime} - ${e.target.value}`})}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
                          />
                        </div>

                      </div>
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-deep mb-1">Years of Experience</label>
                    <input 
                      type="text" 
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white"
                      placeholder="e.g. 15+ Years"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-emerald-teal rounded border-gray-300 focus:ring-emerald-teal"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-emerald-deep">Doctor is Active & Visible</label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <ImageUpload 
                    value={formData.photo || ""} 
                    onChange={(url) => setFormData({...formData, photo: url})} 
                    label="Profile Photo"
                    helpText="Auto-optimized via Cloudinary"
                  />

                  <div>
                    <label className="block text-sm font-medium text-emerald-deep mb-1">About Section (Introduction & Details)</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal bg-white resize-none"
                      placeholder="Brief biography, special interests, etc..."
                    />
                  </div>
                </div>
              </form>
            ); })()}</div>
            
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
                form="doctor-form"
                className="bg-emerald-deep text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-teal transition-colors"
              >
                {editingDoctor ? 'Save Changes' : 'Add Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
