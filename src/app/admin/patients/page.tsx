"use client";

import { useState, useEffect, useMemo } from "react";
import { getAppointments, Appointment } from "@/firebase/db";
import { Search, Phone, Mail, Calendar as CalendarIcon, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface PatientGroup {
  id: string; // use phone as primary id, fallback to name
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  age?: string;
  firstBooking: number;
  latestAppointment: number;
  totalAppointments: number;
  appointments: Appointment[];
}

const SkeletonLoader = () => (
  <div className="space-y-4">
    <div className="w-1/3 h-8 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
    <div className="w-full h-24 bg-gray-100 animate-pulse rounded-2xl"></div>
    <div className="w-full h-24 bg-gray-100 animate-pulse rounded-2xl"></div>
    <div className="w-full h-24 bg-gray-100 animate-pulse rounded-2xl"></div>
  </div>
);

const PatientCard = ({ patient }: { patient: PatientGroup }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:border-emerald-teal/30 transition-colors">
      <div 
        className="p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between cursor-pointer bg-gray-50/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-fredoka text-emerald-deep">{patient.name}</h3>
            <span className="px-2 py-0.5 bg-emerald-soft text-emerald-teal text-[10px] font-bold font-oswald tracking-widest uppercase rounded-full">
              {patient.totalAppointments} Visits
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-text-muted font-sans">
            <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {patient.phone}</div>
            {patient.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {patient.email}</div>}
            {(patient.gender || patient.age) && (
              <div className="flex items-center gap-1.5 text-emerald-teal font-oswald tracking-wide">
                {patient.gender}{patient.age ? `, ${patient.age} yrs` : ''}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
          <div className="text-right font-sans">
            <p className="text-[11px] text-text-muted uppercase font-oswald tracking-wide">Latest Appt</p>
            <p className="text-sm font-medium text-emerald-deep">
              {patient.latestAppointment > 0 ? new Date(patient.latestAppointment).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <button className="text-gray-400 hover:text-emerald-teal transition-colors focus:outline-none">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="bg-white p-5 border-t border-gray-100">
          <h4 className="text-sm font-oswald tracking-wide text-text-muted uppercase mb-4">Appointment History</h4>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {patient.appointments.map((apt, i) => (
              <div key={apt.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-emerald-teal text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[-3px] md:ml-0 z-10">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] bg-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <p className="text-sm font-bold font-oswald text-emerald-deep tracking-wide">{apt.doctorName || apt.doctorId || "Specialist"}</p>
                      <p className="text-[11px] font-sans text-emerald-teal">{apt.departmentId}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold font-oswald tracking-widest uppercase ${
                      apt.status === 'Confirmed' ? 'bg-emerald-soft text-emerald-teal' :
                      apt.status === 'Completed' ? 'bg-gray-200 text-gray-700' :
                      apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-sans text-text-muted mt-2">
                    <div className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-gray-400" /> {apt.date}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /> {apt.time}</div>
                  </div>
                  
                  {apt.patientMessage && (
                    <div className="mt-3 text-[11px] text-text-muted italic bg-white border border-gray-100 p-2 rounded-lg">
                      "{apt.patientMessage}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminPatients() {
  const [patients, setPatients] = useState<PatientGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "appointment" | "booking">("appointment");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [brillianceMode, setBrillianceMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hayawellness_brillianceMode");
    if (saved === "true") setBrillianceMode(true);
  }, []);

  const toggleBrillianceMode = (val: boolean) => {
    setBrillianceMode(val);
    localStorage.setItem("hayawellness_brillianceMode", String(val));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allAppointments = await getAppointments();
      
      const groups = new Map<string, PatientGroup>();
      
      allAppointments.forEach(apt => {
        // Group by Name AND Phone/Email to separate family members using the same contact info
        const nameKey = apt.patientName ? apt.patientName.trim().toLowerCase() : "unknown";
        const contactKey = apt.patientPhone || apt.patientEmail || "";
        const key = `${nameKey}|${contactKey}`;
        
        let aptDateMs = 0;
        try {
           const [y, m, d] = apt.date.split("-").map(Number);
           let hours = 0, minutes = 0;
           if (apt.time) {
             const parts = apt.time.trim().split(" ");
             if (parts.length > 0) {
               const timeParts = parts[0].split(":");
               if (timeParts.length === 2) {
                  hours = parseInt(timeParts[0], 10);
                  minutes = parseInt(timeParts[1], 10);
                  const modifier = parts[1]?.toUpperCase();
                  if (modifier === "PM" && hours < 12) hours += 12;
                  if (modifier === "AM" && hours === 12) hours = 0;
               }
             }
           }
           if (y && m && d) aptDateMs = new Date(y, m - 1, d, hours, minutes).getTime();
           else aptDateMs = new Date(apt.date).getTime();
        } catch(e) {}
        
        let bookDateMs = 0;
        if (apt.createdAt) {
           try { bookDateMs = new Date(apt.createdAt).getTime(); } catch(e) {}
        }

        if (!groups.has(key)) {
          groups.set(key, {
            id: key,
            name: apt.patientName,
            phone: apt.patientPhone,
            email: apt.patientEmail,
            gender: apt.patientGender,
            age: apt.patientAge,
            firstBooking: bookDateMs,
            latestAppointment: aptDateMs,
            totalAppointments: 1,
            appointments: [apt]
          });
        } else {
          const p = groups.get(key)!;
          // Keep newest demographic data
          if (apt.patientEmail && !p.email) p.email = apt.patientEmail;
          if (apt.patientGender && !p.gender) p.gender = apt.patientGender;
          if (apt.patientAge && !p.age) p.age = apt.patientAge;
          
          p.totalAppointments += 1;
          p.appointments.push(apt);
          
          if (aptDateMs > p.latestAppointment) p.latestAppointment = aptDateMs;
          if (bookDateMs > 0 && (p.firstBooking === 0 || bookDateMs < p.firstBooking)) {
            p.firstBooking = bookDateMs;
          }
        }
      });
      
      // Sort appointments inside each patient by latest date
      Array.from(groups.values()).forEach(p => {
        p.appointments.sort((a, b) => {
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
      });

      setPatients(Array.from(groups.values()));
    } catch (err) {
      console.error(err);
      alert("Oops! We couldn't load patients data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedPatients = useMemo(() => {
    // 1. Filter by Search & Focus Mode
    const q = searchQuery.toLowerCase();
    
    // If we are in focus mode (showAllPatients = false) and no search query, show nothing
    if (brillianceMode && !q) return [];

    let result = patients.filter(p => 
      !q || 
      p.name.toLowerCase().includes(q) || 
      p.phone.includes(q) || 
      (p.email && p.email.toLowerCase().includes(q)) ||
      p.appointments.some(a => 
        (a.patientMessage && a.patientMessage.toLowerCase().includes(q)) ||
        (a.id && a.id.toLowerCase().includes(q))
      )
    );

    // 2. Filter by Time Range (if any)
    // You could add a UI for time range later; for now just sort is implemented

    // 3. Sort
    const now = Date.now();
    result = result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === "appointment") {
        // Nearest to today's date first
        const distA = Math.abs(a.latestAppointment - now);
        const distB = Math.abs(b.latestAppointment - now);
        cmp = distA - distB; // smaller diff is smaller
      } else if (sortBy === "booking") {
        // First booked date (oldest first)
        cmp = a.firstBooking - b.firstBooking; 
      }
      return sortOrder === "desc" ? -cmp : cmp;
    });

    return result;
  }, [patients, searchQuery, sortBy, sortOrder, brillianceMode]);

  if (loading) return <SkeletonLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-fredoka text-emerald-deep mb-1">Patients Directory</h1>
          <p className="text-sm font-sans text-text-muted">Comprehensive history of all patients.</p>
        </div>
        
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full ${brillianceMode ? 'lg:w-[60vw]' : 'lg:w-auto'}`}>
          {/* Search */}
          <div className={`relative flex-1 transition-all duration-300 ${brillianceMode ? 'lg:min-w-[60vw]' : 'sm:min-w-[250px] lg:min-w-[300px]'}`}>
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 ${brillianceMode ? 'w-6 h-6 text-emerald-teal' : 'w-4 h-4 text-gray-400'}`} />
            <input 
              type="text" 
              placeholder="Global Search (Name, Phone, Email, Messages)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full transition-all duration-300 focus:outline-none ${
                brillianceMode 
                  ? 'pl-14 pr-6 py-5 text-xl border-[3px] rounded-3xl border-emerald-teal/50 shadow-[0_0_20px_rgba(4,114,77,0.2)] bg-white/90 backdrop-blur focus:border-emerald-teal focus:shadow-[0_0_30px_rgba(4,114,77,0.4)]' 
                  : 'pl-11 pr-4 py-3 text-sm border-2 rounded-2xl border-gray-200 focus:border-emerald-teal bg-white'
              }`}
            />
          </div>
          
          <button 
            onClick={() => toggleBrillianceMode(!brillianceMode)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-oswald uppercase tracking-wider text-xs whitespace-nowrap ${brillianceMode ? 'border-emerald-teal bg-emerald-teal text-white shadow-lg' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
          >
            <span className={`w-2 h-2 rounded-full ${brillianceMode ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></span>
            Brilliance Mode
          </button>
          
          {/* Sort */}
          <div className={`bg-white border-2 border-gray-200 rounded-2xl overflow-hidden flex items-center shrink-0 transition-opacity duration-300 ${brillianceMode ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>
            <span className="pl-3 pr-2 py-3 text-xs font-medium font-oswald tracking-wide text-gray-400 uppercase border-r border-gray-100 bg-gray-50">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-3 text-sm font-sans text-emerald-deep bg-white focus:outline-none cursor-pointer border-r border-gray-100"
            >
              <option value="appointment">Appt Date</option>
              <option value="booking">Booking Date</option>
              <option value="name">Alphabetical</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-3 text-sm font-sans text-emerald-deep bg-white focus:outline-none cursor-pointer"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {filteredAndSortedPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
        {filteredAndSortedPatients.length === 0 && (
          brillianceMode && !searchQuery ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
               <div className="w-16 h-16 rounded-full bg-emerald-soft flex items-center justify-center animate-pulse">
                 <Search className="w-8 h-8 text-emerald-teal" />
               </div>
               <p className="text-xl font-fredoka text-emerald-deep">Brilliance Mode Active</p>
               <p className="text-sm font-sans text-text-muted max-w-md mx-auto">Patients are hidden to maintain a clean workspace. Use the search bar above to instantly find any patient record by name, phone, email, or message.</p>
            </div>
          ) : (
            <div className="py-16 text-center bg-white border border-gray-100 rounded-2xl">
              <p className="text-lg font-fredoka text-emerald-deep mb-2">No patients found</p>
              <p className="text-sm font-sans text-text-muted">Try adjusting your search filters.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
