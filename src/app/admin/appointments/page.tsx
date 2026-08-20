"use client";

import { useState, useEffect } from "react";
import { getAppointments, updateAppointmentStatus, Appointment } from "@/firebase/db";
import { CheckCircle, Clock, XCircle, Search, Filter } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-2xl font-serif text-emerald-deep mb-1">Appointments Management</h1>
          <p className="text-sm text-text-muted">View and manage patient bookings and schedules.</p>
        </div>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Patient Info</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Department</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Date & Time</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="py-4 px-6">
                  <p className="text-sm font-medium text-emerald-deep">{apt.patientName}</p>
                  <p className="text-xs text-text-muted">{apt.patientEmail}</p>
                  <p className="text-xs text-text-muted">{apt.patientPhone}</p>
                </td>
                <td className="py-4 px-6 text-sm text-text-muted">{apt.departmentId}</td>
                <td className="py-4 px-6">
                  <p className="text-sm font-medium text-emerald-deep">{apt.date}</p>
                  <p className="text-xs text-text-muted">{apt.time}</p>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'Confirmed' ? 'bg-emerald-soft text-emerald-teal' :
                    apt.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                    apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                    'bg-gold-subtle/20 text-gold-subtle'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <select 
                    value={apt.status}
                    onChange={(e) => apt.id && handleStatusChange(apt.id, e.target.value as any)}
                    className="p-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal text-emerald-deep bg-gray-50"
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
                <td colSpan={5} className="py-8 text-center text-text-muted">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
