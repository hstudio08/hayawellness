"use client";

import { useState, useEffect } from "react";
import { getAppointments, updateAppointmentStatus, Appointment } from "@/firebase/db";
import { CheckCircle, Clock, XCircle, Search, Filter } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) return <div className="text-emerald-deep font-semibold">Loading appointments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-emerald-deep mb-1">Appointments Calendar</h1>
          <p className="text-sm text-text-muted">View and manage patient bookings and schedules.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg text-sm text-emerald-deep focus:outline-none focus:border-emerald-teal"
          />
          <button 
            onClick={() => setSelectedDate("")}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Patient Info</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Doctor & Specialty</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Date & Time</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments
              .filter(apt => {
                if (!selectedDate) return true;
                try {
                  const d = new Date(apt.date);
                  const isoDate = d.toISOString().split('T')[0];
                  return isoDate === selectedDate;
                } catch(e) { return true; }
              })
              .map(apt => (
              <tr key={apt.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <p className="text-sm font-medium text-emerald-deep">{apt.patientName}</p>
                  <p className="text-xs text-text-muted">{apt.patientPhone}</p>
                  {apt.patientEmail && <p className="text-xs text-text-muted">{apt.patientEmail}</p>}
                  {(apt.patientAge || apt.patientGender) && (
                    <p className="text-[11px] text-emerald-teal mt-0.5">
                      {apt.patientGender}{apt.patientAge ? `, ${apt.patientAge} yrs` : ''}
                    </p>
                  )}
                  {apt.patientMessage && (
                    <p className="text-[11px] text-text-muted italic mt-1 max-w-xs line-clamp-1">
                      "{apt.patientMessage}"
                    </p>
                  )}
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm font-medium text-emerald-deep">{apt.doctorName || apt.doctorId || "Specialist"}</p>
                  <p className="text-xs text-emerald-teal font-medium">{apt.departmentId}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm font-medium text-emerald-deep">{apt.date}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-emerald-teal" /> {apt.time}
                  </p>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'Confirmed' ? 'bg-emerald-soft text-emerald-teal' :
                    apt.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                    apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <select 
                    value={apt.status}
                    onChange={(e) => apt.id && handleStatusChange(apt.id, e.target.value as any)}
                    className="p-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal text-emerald-deep bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-text-muted">
                  No appointments booked yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
