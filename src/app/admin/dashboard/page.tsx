"use client";

import { useEffect, useState } from "react";
import { Activity, Calendar, Users, FileText, Database } from "lucide-react";
import { getAppointments, getDoctors, getDepartments, Appointment } from "@/firebase/db";
import { DOCTORS, DEPARTMENTS } from "@/data/mockData";
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apts = await getAppointments();
      const docs = await getDoctors();
      const depts = await getDepartments();
      
      setAppointments(apts);
      setDoctorCount(docs.length);
      setDepartmentCount(depts.length);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!window.confirm("Are you sure you want to seed the database with mock data?")) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      
      DEPARTMENTS.forEach(dept => {
        const ref = doc(collection(db, "departments"));
        batch.set(ref, dept);
      });
      
      DOCTORS.forEach(docData => {
        const ref = doc(collection(db, "doctors"));
        batch.set(ref, docData);
      });

      await batch.commit();
      alert("Database seeded successfully!");
      fetchData();
    } catch (err) {
      console.error("Seeding error:", err);
      alert("Error seeding database.");
    } finally {
      setSeeding(false);
    }
  };

  const todayApts = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  const stats = [
    { label: "Today's Appointments", value: todayApts.length.toString(), change: "Active", icon: Calendar },
    { label: "Total Doctors", value: doctorCount.toString(), change: "Available", icon: Users },
    { label: "Departments", value: departmentCount.toString(), change: "Active", icon: Activity },
    { label: "Total Appointments", value: appointments.length.toString(), change: "All Time", icon: FileText },
  ];

  if (loading) {
    return <div className="animate-pulse text-emerald-deep font-semibold">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-serif text-emerald-deep">Overview</h1>
          <p className="text-text-muted text-sm mt-1">Monitor your hospital's daily operations.</p>
        </div>
        <button 
          onClick={seedDatabase} 
          disabled={seeding}
          className="flex items-center gap-2 bg-emerald-soft text-emerald-teal px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-teal hover:text-white transition-colors"
        >
          <Database className="w-4 h-4" />
          {seeding ? "Seeding..." : "Seed Mock Data"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-soft rounded-lg flex items-center justify-center text-emerald-teal">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-teal bg-emerald-soft px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-text-muted mb-1">{stat.label}</h3>
            <p className="text-3xl font-serif text-emerald-deep">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-serif text-emerald-deep">Recent Appointments</h3>
          </div>
          <div className="overflow-x-auto">
            {appointments.length === 0 ? (
              <p className="text-text-muted text-sm py-4">No appointments found.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Patient</th>
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date & Time</th>
                    <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((apt, i) => (
                    <tr key={apt.id || i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-sm font-medium text-emerald-deep">{apt.patientName}</td>
                      <td className="py-4 text-sm text-text-muted">{apt.departmentId}</td>
                      <td className="py-4 text-sm text-text-muted">{apt.date} at {apt.time}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'Confirmed' ? 'bg-emerald-soft text-emerald-teal' :
                          apt.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                          apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-gold-subtle/20 text-gold-subtle'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <div className="bg-emerald-deep text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div>
            <h3 className="text-lg font-serif mb-2">Haya System Status</h3>
            <p className="text-emerald-soft/80 text-sm mb-6 leading-relaxed">
              All systems are operational. Firebase connection is active and data is syncing in real-time.
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Status</span>
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-teal bg-white px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-teal animate-pulse"></span>
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
