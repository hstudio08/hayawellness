"use client";

import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { getAppointmentsByEmail, updateAppointmentStatus, rescheduleAppointment, Appointment, getPatientProfile, updatePatientProfile, PatientProfile } from "@/firebase/db";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { Calendar as CalendarIcon, User as UserIcon, LogOut, FileText, ChevronRight, CheckCircle2, Clock, XCircle, X, CalendarClock, Edit2, Check, Plus } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Inline Appointment Card component for individual state management
function AppointmentCard({ apt, onUpdate }: { apt: Appointment, onUpdate: () => void }) {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);

  const reschedules = apt.rescheduleCount || 0;
  const canReschedule = reschedules < 2 && apt.status !== "Cancelled" && apt.status !== "Completed";
  const canCancel = apt.status !== "Cancelled" && apt.status !== "Completed";

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setLoading(true);
    try {
      await updateAppointmentStatus(apt.id!, "Cancelled");
      onUpdate();
    } catch(e) {
      alert("Failed to cancel.");
    }
    setLoading(false);
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) return alert("Please select a new date and time.");
    setLoading(true);
    try {
      // Basic formatting for time
      const [h, m] = newTime.split(':');
      let hh = parseInt(h);
      const ampm = hh >= 12 ? 'PM' : 'AM';
      hh = hh % 12 || 12;
      const formattedTime = `${hh.toString().padStart(2, '0')}:${m} ${ampm}`;

      await rescheduleAppointment(apt.id!, newDate, formattedTime, reschedules + 1);
      setIsRescheduling(false);
      onUpdate();
    } catch(e) {
      alert("Failed to reschedule.");
    }
    setLoading(false);
  };

  let StatusIcon = Clock;
  let statusColor = "text-yellow-600 bg-yellow-50";
  if (apt.status === "Confirmed") { StatusIcon = CheckCircle2; statusColor = "text-emerald-teal bg-emerald-soft"; }
  if (apt.status === "Completed") { StatusIcon = CheckCircle2; statusColor = "text-blue-600 bg-blue-50"; }
  if (apt.status === "Cancelled") { StatusIcon = XCircle; statusColor = "text-red-600 bg-red-50"; }

  const docName = apt.doctorName ? (apt.doctorName.toLowerCase().startsWith('dr.') ? apt.doctorName : `Dr. ${apt.doctorName}`) : 'Any Available';

  return (
    <div className="flex flex-col p-5 rounded-3xl border border-gray-100 hover:border-emerald-teal/30 hover:shadow-lg hover:shadow-emerald-deep/5 transition-all gap-5 bg-white">
      {/* Top row: Status, Department, Doc, Date */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
           <div className={`p-3 rounded-2xl ${statusColor}`}>
             <StatusIcon className="w-6 h-6" />
           </div>
           <div>
             <h3 className="font-fredoka text-emerald-deep text-lg sm:text-xl flex flex-wrap items-center gap-x-2">
               {apt.departmentId.replace(/-/g, ' ')} 
               <span className="text-gray-300 text-sm font-sans hidden sm:inline">•</span> 
               <span className="text-gray-600 text-sm sm:text-base font-sans">{apt.patientName}</span>
             </h3>
             <p className="text-sm font-sans text-text-muted mt-1">
               {apt.date} • {apt.time}
             </p>
             <p className="text-xs font-oswald uppercase tracking-wider text-emerald-teal mt-1">
               {docName}
             </p>
           </div>
        </div>
        <span className={`text-xs font-oswald uppercase tracking-widest px-4 py-1.5 rounded-full self-start sm:self-center ${statusColor}`}>
           {apt.status}
        </span>
      </div>
      
      {/* Reschedule Inline Form */}
      {isRescheduling && (
        <div className="bg-emerald-soft/50 p-4 rounded-2xl border border-emerald-teal/20 flex flex-col sm:flex-row gap-3 items-end animate-in fade-in zoom-in-95 duration-200">
          <div className="flex-1 w-full">
            <label className="text-xs font-oswald text-emerald-deep uppercase tracking-wider mb-1 block">New Date</label>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-emerald-teal/30 focus:outline-none focus:ring-2 focus:ring-emerald-teal text-sm" />
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-oswald text-emerald-deep uppercase tracking-wider mb-1 block">New Time</label>
            <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-emerald-teal/30 focus:outline-none focus:ring-2 focus:ring-emerald-teal text-sm" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
             <button disabled={loading} onClick={() => setIsRescheduling(false)} className="flex-1 sm:flex-none px-4 py-2 bg-white text-gray-500 rounded-xl border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>
             <button disabled={loading} onClick={handleReschedule} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-teal text-white rounded-xl text-sm hover:bg-emerald-deep shadow-md font-medium">{loading ? 'Saving...' : 'Confirm'}</button>
          </div>
        </div>
      )}

      {/* Action Buttons (100% Mobile Optimized stacked vs row) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-2 border-t border-gray-50 pt-4">
        {canCancel && !isRescheduling && (
           <button 
             onClick={handleCancel} disabled={loading}
             className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-100 text-red-500 bg-red-50/50 hover:bg-red-50 transition-colors text-sm font-medium"
           >
             <X className="w-4 h-4" /> Cancel Booking
           </button>
        )}
        {canReschedule && !isRescheduling && (
           <button 
             onClick={() => setIsRescheduling(true)}
             className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-teal text-emerald-teal bg-white hover:bg-emerald-soft transition-colors text-sm font-medium"
           >
             <CalendarClock className="w-4 h-4" /> Reschedule ({2 - reschedules} left)
           </button>
        )}
        {!canReschedule && reschedules >= 2 && apt.status !== "Cancelled" && apt.status !== "Completed" && (
           <span className="text-xs text-orange-500 font-sans italic text-center sm:text-right px-2">Max reschedules reached</span>
        )}
        <Link 
           href={`/patient/receipt/${apt.id}`}
           target="_blank"
           className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium font-sans border border-gray-200"
        >
           <FileText className="w-4 h-4 text-gray-500" /> View Receipt
        </Link>
      </div>
    </div>
  )
}

export default function PatientPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [fetching, setFetching] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        loadData(currentUser.email);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadData = async (email: string) => {
    setFetching(true);
    try {
      const data = await getAppointmentsByEmail(email);
      setAppointments(data);
      
      let p = await getPatientProfile(email);
      if (!p && data.length > 0) {
        // Auto-create profile from first appointment
        await updatePatientProfile(email, data[0].patientName);
        p = { email, name: data[0].patientName };
      }
      setProfile(p);
      setEditName(p?.name || "Patient");
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

  const saveName = async () => {
    if (!user?.email || !editName.trim()) return;
    await updatePatientProfile(user.email, editName.trim());
    setProfile({ email: user.email, name: editName.trim() });
    setIsEditingName(false);
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
      alert("Failed to sign in. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAppointments([]);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ivory-warm">
        <div className="w-12 h-12 border-4 border-emerald-teal border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  // Display all appointments associated with this logged in email
  const displayAppointments = appointments;

  return (
    <main className="min-h-screen flex flex-col bg-ivory-warm">
      
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-16 sm:py-24 md:py-32">
        {!user ? (
          <div className="max-w-md mx-auto bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-emerald-deep/5 border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-500 mt-10">
            <div className="w-20 h-20 bg-emerald-soft rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-10 h-10 text-emerald-teal" />
            </div>
            <h1 className="text-3xl font-fredoka text-emerald-deep mb-3">Patient Portal</h1>
            <p className="text-text-muted font-sans mb-8 text-sm sm:text-base">Sign in securely with the email address you used to book your appointments to manage your schedule, cancel/reschedule, and download receipts.</p>
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-oswald uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm text-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign In With Google
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-deep/5 border border-gray-100 overflow-hidden">
             <div className="bg-emerald-deep p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
               
               <div className="relative z-10 w-full md:w-auto text-center md:text-left flex-1">
                 {isEditingName ? (
                   <div className="flex items-center gap-2 max-w-sm mx-auto md:mx-0">
                     <input 
                       type="text" 
                       value={editName}
                       onChange={e => setEditName(e.target.value)}
                       className="bg-white/10 border border-white/30 rounded-lg px-3 py-1.5 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-teal font-fredoka text-xl sm:text-2xl w-full"
                       placeholder="Your Name"
                     />
                     <button onClick={saveName} className="p-2 bg-emerald-teal hover:bg-emerald-soft hover:text-emerald-deep rounded-lg transition-colors">
                       <Check className="w-5 h-5" />
                     </button>
                     <button onClick={() => setIsEditingName(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                 ) : (
                   <h1 className="text-2xl sm:text-3xl font-fredoka mb-1 flex items-center justify-center md:justify-start gap-3">
                     Welcome, {profile?.name || 'Patient'}!
                     <button onClick={() => setIsEditingName(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-70 hover:opacity-100" title="Edit Profile Name">
                       <Edit2 className="w-4 h-4" />
                     </button>
                   </h1>
                 )}
                 <p className="text-emerald-soft font-sans text-sm sm:text-base opacity-80 mt-1">{user.email}</p>
               </div>

               <div className="relative z-10 flex flex-col sm:flex-row w-full md:w-auto gap-3">
                 <Link 
                   href="/appointment"
                   className="flex items-center justify-center w-full sm:w-auto gap-2 bg-emerald-teal hover:bg-emerald-soft hover:text-emerald-deep text-white px-6 py-3 rounded-2xl transition-colors text-sm font-oswald uppercase tracking-wider shadow-lg"
                 >
                   <Plus className="w-4 h-4" /> Book Appt
                 </Link>
                 <button 
                   onClick={handleLogout}
                   className="flex items-center justify-center w-full sm:w-auto gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm transition-colors text-sm font-oswald uppercase tracking-wider border border-white/10"
                 >
                   <LogOut className="w-4 h-4" /> Sign Out
                 </button>
               </div>
             </div>
            
            <div className="p-4 sm:p-8 md:p-10 bg-gray-50/50">
              <h2 className="text-xl font-fredoka text-emerald-deep mb-6 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-teal" /> Your Appointments History
              </h2>
              
              {fetching ? (
                <div className="text-center py-16">
                   <div className="w-10 h-10 border-4 border-emerald-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                   <p className="text-text-muted font-sans">Loading your secure records...</p>
                </div>
              ) : displayAppointments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CalendarIcon className="w-8 h-8 text-gray-300" />
                   </div>
                   <p className="text-xl font-fredoka text-emerald-deep mb-2">No appointments found.</p>
                   <p className="text-sm font-sans text-text-muted max-w-sm mx-auto">We couldn't find any bookings associated with your profile name.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {displayAppointments.map(apt => (
                    <AppointmentCard 
                      key={apt.id} 
                      apt={apt} 
                      onUpdate={() => loadData(user.email!)} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
