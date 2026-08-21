"use client";

import { useState, useEffect, useMemo } from "react";
import { getAppointments, updateAppointmentStatus, Appointment } from "@/firebase/db";
import { Clock, Search, ChevronDown, ChevronUp } from "lucide-react";

const SkeletonLoader = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-6">
      <div className="w-1/3 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
      <div className="w-1/4 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
    </div>
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl"></div>
  </div>
);

const AppointmentMobileCard = ({ apt, onStatusChange }: { apt: Appointment, onStatusChange: (id: string, status: any) => void }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-teal/10 shadow-sm relative overflow-hidden flex flex-col gap-3">
      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-soft/40 rounded-full blur-xl -mr-10 -mt-10"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-base font-fredoka text-emerald-deep">{apt.patientName}</p>
          <p className="text-xs font-sans text-text-muted">{apt.patientPhone}</p>
          {(apt.patientAge || apt.patientGender) && (
            <p className="text-[11px] font-oswald text-emerald-teal tracking-wide mt-0.5">
              {apt.patientGender}{apt.patientAge ? `, ${apt.patientAge} yrs` : ''}
            </p>
          )}
        </div>
        
        <select 
          value={apt.status}
          onChange={(e) => apt.id && onStatusChange(apt.id, e.target.value)}
          className={`px-2 py-1 text-[10px] font-bold font-oswald tracking-widest uppercase rounded-full shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-teal/50 ${
            apt.status === 'Confirmed' ? 'bg-emerald-soft text-emerald-teal' :
            apt.status === 'Completed' ? 'bg-gray-200 text-gray-700' :
            apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
            'bg-amber-50 text-amber-600 border border-amber-100'
          }`}
          style={{ backgroundImage: 'none' }}
        >
          <option value="Pending">PENDING</option>
          <option value="Confirmed">CONFIRMED</option>
          <option value="Completed">COMPLETED</option>
          <option value="Cancelled">CANCELLED</option>
        </select>
      </div>
      
      <div className="bg-white/90 p-3 rounded-lg border border-white shadow-sm relative z-10 flex flex-col gap-1">
        <p className="text-xs font-bold font-oswald text-emerald-deep tracking-wide">{apt.doctorName || apt.doctorId || "Specialist"}</p>
        <p className="text-[10px] font-sans text-text-muted">{apt.departmentId}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-teal font-oswald tracking-wide">
          <Clock className="w-3.5 h-3.5" />
          {apt.date} @ {apt.time}
        </div>
      </div>

      {apt.patientMessage && (
        <div className="relative z-10 font-sans">
          <p className={`text-[11px] text-text-muted italic bg-white/60 border border-emerald-teal/5 p-2 rounded-lg leading-relaxed ${!expanded && 'line-clamp-2'}`}>
            "{apt.patientMessage}"
          </p>
          {apt.patientMessage.length > 80 && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-medium text-emerald-teal mt-1 flex items-center gap-0.5 ml-1 focus:outline-none"
            >
              {expanded ? 'Show less' : 'Read more'} {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateFilterMode, setDateFilterMode] = useState<"appointment" | "booking">("appointment");
  const [timeRange, setTimeRange] = useState<"all" | "today" | "week" | "month" | "year" | "exact">("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      data.sort((a, b) => {
          let tA = 0;
          try {
             const [y, m, d] = a.date.split("-").map(Number);
             let h = 0, min = 0;
             if (a.time) {
                const parts = a.time.trim().split(" ");
                if (parts[0]) {
                  const tp = parts[0].split(":");
                  if (tp.length === 2) {
                     h = parseInt(tp[0], 10);
                     min = parseInt(tp[1], 10);
                     const mod = parts[1]?.toUpperCase();
                     if (mod === "PM" && h < 12) h += 12;
                     if (mod === "AM" && h === 12) h = 0;
                  }
                }
             }
             if (y && m && d) tA = new Date(y, m - 1, d, h, min).getTime();
          } catch(e) {}
          
          let tB = 0;
          try {
             const [y, m, d] = b.date.split("-").map(Number);
             let h = 0, min = 0;
             if (b.time) {
                const parts = b.time.trim().split(" ");
                if (parts[0]) {
                  const tp = parts[0].split(":");
                  if (tp.length === 2) {
                     h = parseInt(tp[0], 10);
                     min = parseInt(tp[1], 10);
                     const mod = parts[1]?.toUpperCase();
                     if (mod === "PM" && h < 12) h += 12;
                     if (mod === "AM" && h === 12) h = 0;
                  }
                }
             }
             if (y && m && d) tB = new Date(y, m - 1, d, h, min).getTime();
          } catch(e) {}
          
          return tB - tA; // Newest first
      });
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
      alert("Oops! We couldn't update the appointment.");
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // 1. Text Search Filter
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q || 
        apt.patientName.toLowerCase().includes(q) || 
        apt.patientPhone.includes(q) || 
        (apt.patientEmail && apt.patientEmail.toLowerCase().includes(q)) ||
        (apt.patientMessage && apt.patientMessage.toLowerCase().includes(q));

      // 2. Date Filter
      let matchesDate = true;
      if (timeRange !== "all") {
        try {
          let targetDateStr = apt.date;
          if (dateFilterMode === "booking" && apt.createdAt) {
            targetDateStr = typeof apt.createdAt === 'string' 
              ? apt.createdAt 
              : new Date(apt.createdAt).toISOString();
          }

          const targetDateObj = new Date(targetDateStr);
          const now = new Date();

          if (timeRange === "today") {
             matchesDate = targetDateObj.toDateString() === now.toDateString();
          } else if (timeRange === "week") {
             const oneWeekAgo = new Date();
             oneWeekAgo.setDate(now.getDate() - 7);
             matchesDate = targetDateObj >= oneWeekAgo && targetDateObj <= now;
          } else if (timeRange === "month") {
             matchesDate = targetDateObj.getMonth() === now.getMonth() && targetDateObj.getFullYear() === now.getFullYear();
          } else if (timeRange === "year") {
             matchesDate = targetDateObj.getFullYear() === now.getFullYear();
          } else if (timeRange === "exact" && selectedDate) {
             const filterDateObj = new Date(selectedDate);
             matchesDate = 
               filterDateObj.getFullYear() === targetDateObj.getFullYear() &&
               filterDateObj.getMonth() === targetDateObj.getMonth() &&
               filterDateObj.getDate() === targetDateObj.getDate();
          }
        } catch (e) {
          matchesDate = false;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [appointments, searchQuery, selectedDate, dateFilterMode, timeRange]);

  if (loading) return <SkeletonLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl font-fredoka text-emerald-deep mb-1">Appointments Calendar</h1>
          <p className="text-sm font-sans text-text-muted">Manage patient bookings and schedules.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal focus:ring-1 focus:ring-emerald-teal"
            />
          </div>
          
          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-1 sm:flex-none bg-white border border-gray-200 rounded-lg overflow-hidden">
            <select
              value={dateFilterMode}
              onChange={(e) => setDateFilterMode(e.target.value as any)}
              className="px-2 py-2 text-xs font-medium font-oswald text-gray-600 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="appointment">Appt Date</option>
              <option value="booking">Booked Date</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value as any);
                if (e.target.value !== 'exact') setSelectedDate('');
              }}
              className="px-2 py-2 text-sm text-emerald-deep focus:outline-none bg-white cursor-pointer border-b sm:border-b-0 sm:border-r border-gray-200"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="exact">Exact Date...</option>
            </select>
            
            {timeRange === 'exact' && (
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-2 w-full sm:w-auto text-sm text-emerald-deep focus:outline-none bg-white"
              />
            )}
          </div>

          {(timeRange !== "all" || selectedDate) && (
            <button 
              onClick={() => { setTimeRange("all"); setSelectedDate(""); }}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium font-oswald tracking-wide hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase">Patient Info</th>
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase">Doctor & Specialty</th>
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase">Date & Time</th>
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase text-center">Status</th>
                <th className="py-4 px-6 text-xs font-semibold font-oswald tracking-wide text-text-muted uppercase text-right">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(apt => (
                <tr key={apt.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-emerald-deep font-sans">{apt.patientName}</p>
                    <p className="text-xs font-sans text-text-muted">{apt.patientPhone}</p>
                    {apt.patientEmail && <p className="text-xs font-sans text-text-muted">{apt.patientEmail}</p>}
                    {(apt.patientAge || apt.patientGender) && (
                      <p className="text-[11px] font-sans text-emerald-teal mt-0.5">
                        {apt.patientGender}{apt.patientAge ? `, ${apt.patientAge} yrs` : ''}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium font-sans text-emerald-deep">{apt.doctorName || apt.doctorId || "Specialist"}</p>
                    <p className="text-xs font-sans text-emerald-teal font-medium">{apt.departmentId}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium font-sans text-emerald-deep">{apt.date}</p>
                    <p className="text-xs font-sans text-text-muted flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-emerald-teal" /> {apt.time}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-oswald tracking-wide ${
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
                      className="p-1.5 text-sm font-sans border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-teal text-emerald-deep bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center font-sans text-text-muted">
                    No appointments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col p-3 gap-4 bg-gray-50/30">
          {filteredAppointments.map((apt, index, arr) => (
            <div key={apt.id} className={`flex flex-col gap-3 ${index !== arr.length - 1 ? 'border-b border-dotted border-gray-300 pb-4' : ''}`}>
               <AppointmentMobileCard apt={apt} onStatusChange={handleStatusChange} />
            </div>
          ))}
          {filteredAppointments.length === 0 && (
            <div className="py-10 text-center font-sans text-text-muted bg-white rounded-xl border border-gray-100">
              No appointments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
