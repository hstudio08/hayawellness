"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { DEPARTMENTS, DOCTORS } from "@/data/mockData";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

// Parse time string like '10:00 AM - 02:00 PM' or '09:00 - 17:00'
function parseTime(t: string = ""): number {
  t = t.trim();
  let parts = t.split(' ');
  let time = parts[0];
  let modifier = parts[1];
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier) {
    if (hours === 12) {
      hours = modifier.toUpperCase() === 'PM' ? 12 : 0;
    } else if (modifier.toUpperCase() === 'PM') {
      hours += 12;
    }
  }
  return hours * 60 + (minutes || 0);
}

function formatTime(minutes: number): string {
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; 
  let mStr = m < 10 ? '0' + m : m;
  return `${h < 10 ? '0'+h : h}:${mStr} ${ampm}`;
}

function generateTimeSlots(timingStr: string = '09:00 - 17:00', slotsCount: number = 10): string[] {
  try {
    if (!timingStr) throw new Error();
    const parts = timingStr.split('-');
    if (parts.length < 2) throw new Error();
    let startMins = parseTime(parts[0]);
    let endMins = parseTime(parts[1]);
    
    let slots = [];
    let currentMins = startMins;
    while (currentMins < endMins && slots.length < slotsCount) {
      slots.push(formatTime(currentMins));
      currentMins += 30;
    }
    return slots.length > 0 ? slots : ['10:00 AM'];
  } catch(e) {
    return ['09:00 AM', '09:30 AM', '10:00 AM'];
  }
}
import { getDoctors, getDepartments, addAppointment, getAppointmentsByEmail, Doctor, Department } from "@/firebase/db";
import { addDays, format, isBefore, startOfToday } from "date-fns";
import { CheckCircle2, ChevronLeft, Calendar as CalendarIcon, Clock, User, Phone, Mail, AlertCircle, Loader2 } from "lucide-react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import clsx from "clsx";

import { IconRenderer } from "@/components/ui/IconRenderer";

function AppointmentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialDept = searchParams.get("department");
  const initialDoc = searchParams.get("doctor");

  const [departmentsList, setDepartmentsList] = useState<Department[]>(DEPARTMENTS as unknown as Department[]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS as unknown as Doctor[]);
  const [loadingData, setLoadingData] = useState(true);

  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(initialDept);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(initialDoc);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: "", email: "", phone: "", age: "", gender: "Male", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setCurrentUser(u);
      if (u && u.email) {
        setPatientDetails(prev => ({ ...prev, email: u.email! }));
        try {
          const apts = await getAppointmentsByEmail(u.email);
          if (apts.length > 0) {
            apts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setPatientDetails(prev => ({
              ...prev,
              phone: apts[0].patientPhone || prev.phone,
              name: apts[0].patientName || prev.name
            }));
          }
        } catch (e) {
          console.error("Failed to load previous booking details for autofill", e);
        }
      }
    });
    return () => unsub();
  }, []);
  // Load live departments and doctors from Firestore
  useEffect(() => {
    async function loadFirebaseData() {
      try {
        const [depts, docs] = await Promise.all([getDepartments(), getDoctors()]);
        if (depts && depts.length > 0) {
          setDepartmentsList(depts.filter(d => d.isActive !== false));
        }
        if (docs && docs.length > 0) {
          setDoctorsList(docs.filter(d => d.isActive !== false));
        }
      } catch (err) {
        console.error("Error loading doctors/departments from Firebase:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadFirebaseData();
  }, []);

  // If a doctor is passed initially, auto-select their department
  useEffect(() => {
    if (initialDoc && doctorsList.length > 0) {
      const docItem = doctorsList.find(d => d.id === initialDoc || d.slug === initialDoc);
      if (docItem) {
        setSelectedDept(docItem.departmentId);
        setSelectedDoc(docItem.id || docItem.slug);
        setStep(3); // Jump to date selection
      }
    } else if (initialDept) {
      setSelectedDept(initialDept);
      setStep(2); // Jump to doctor selection
    }
  }, [initialDoc, initialDept, doctorsList]);

  // Load booked slots whenever doctor or date changes
  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedDoc || !selectedDate) {
        setBookedSlots([]);
        return;
      }
      setIsLoadingSlots(true);
      try {
        const dateStr = format(selectedDate, "MMM dd, yyyy");
        const q = query(
          collection(db, "appointments"),
          where("doctorId", "==", selectedDoc)
        );
        const snapshot = await getDocs(q);
        const booked = snapshot.docs
          .map(d => d.data())
          .filter(a => a.date === dateStr && (a.status === "Pending" || a.status === "Confirmed"))
          .map(a => a.time as string);
        setBookedSlots(booked);
      } catch (e) {
        console.error("Failed to fetch booked slots:", e);
        setBookedSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    fetchBookedSlots();
  }, [selectedDoc, selectedDate]);

  const availableDoctors = selectedDept 
    ? doctorsList.filter(d => d.departmentId === selectedDept || d.departmentId.toLowerCase() === selectedDept.toLowerCase()) 
    : doctorsList;
  const doctor = selectedDoc ? doctorsList.find(d => d.id === selectedDoc || d.slug === selectedDoc) : null;
  const department = selectedDept ? departmentsList.find(d => d.id === selectedDept || d.slug === selectedDept || d.name.toLowerCase() === selectedDept.toLowerCase()) : null;

  // Generate available time slots based on doctor's timings and slots
  const timeSlots = generateTimeSlots(doctor?.timings, doctor?.slots || 10);

  // Next 14 days
  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i + 1));

  const handleNext = () => setStep(s => Math.min(s + 1, 6));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !selectedDoc) {
      alert("Please ensure Doctor, Date, and Time are selected.");
      return;
    }
    if (!patientDetails.name || !patientDetails.phone) {
      alert("Please fill in your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dateStr = format(selectedDate, "MMM dd, yyyy");
      
      // Safety check for double booking without complex Firestore composite indexes
      const qCheck = query(
        collection(db, "appointments"), 
        where("doctorId", "==", selectedDoc)
      );
      const snapshot = await getDocs(qCheck);
      const isAlreadyTaken = snapshot.docs.some(d => {
        const data = d.data();
        return data.date === dateStr && data.time === selectedTime && (data.status === "Pending" || data.status === "Confirmed");
      });
      
      if (isAlreadyTaken) {
        alert("This time slot was just booked by another patient. Please select a different time slot.");
        setStep(4);
        setIsSubmitting(false);
        return;
      }

      // Save appointment directly to Firestore
      const newAppointment = {
        patientName: patientDetails.name.trim(),
        patientEmail: (patientDetails.email || "").trim(),
        patientPhone: patientDetails.phone.trim(),
        patientAge: patientDetails.age ? String(patientDetails.age) : "",
        patientGender: patientDetails.gender || "Male",
        patientMessage: (patientDetails.message || "").trim(),
        departmentId: department?.name || selectedDept || "",
        doctorId: selectedDoc,
        doctorName: doctor?.name || "Specialist Doctor",
        date: dateStr,
        time: selectedTime,
        status: "Pending" as const,
        createdAt: new Date().toISOString()
      };

      const docRef = await addAppointment(newAppointment);

      // Route to success page with actual appointment ID
      router.push(`/appointment/success?id=${docRef.id}`);
    } catch(err) {
      console.error("Booking error:", err);
      alert("Could not complete booking: " + (err instanceof Error ? err.message : "Please check your network and try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-emerald-deep/5 border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-emerald-soft p-4 md:p-6 flex items-center justify-center border-b border-emerald-teal/20">
        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between w-full">
           <span className="text-xs font-bold uppercase tracking-widest text-emerald-deep">Step {step} of 6</span>
           <span className="text-xs font-semibold text-emerald-teal">
             {["Department", "Doctor", "Date", "Time", "Details", "Review"][step - 1]}
           </span>
        </div>
        
        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-2">
          {["Department", "Doctor", "Date", "Time", "Details", "Review"].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className={clsx(
                "whitespace-nowrap text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1",
                step === idx + 1 ? "bg-emerald-deep text-white" : step > idx + 1 ? "text-emerald-teal" : "text-emerald-teal/40"
              )}>
                {step > idx + 1 && <CheckCircle2 className="w-3 h-3" />}
                {label}
              </div>
              {idx < 5 && <div className={clsx("w-4 h-px mx-1", step > idx + 1 ? "bg-emerald-teal" : "bg-emerald-teal/20")} />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-10">
        {step > 1 && (
          <button onClick={handleBack} className="flex items-center gap-1 text-sm text-text-muted hover:text-emerald-deep mb-4 md:mb-6 transition-colors font-medium">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}

        {/* Step 1: Department */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl md:text-3xl font-serif text-emerald-deep mb-2">Choose Department</h2>
            <p className="text-sm md:text-base text-text-muted mb-6 md:mb-8">Select the medical specialty you need.</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {loadingData ? (
                Array.from({length: 6}).map((_, i) => (
                  <div key={i} className="p-4 md:p-6 rounded-2xl border border-gray-100 bg-gray-50/50 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))
              ) : (
                departmentsList.map(dept => (
                  <button
                    key={dept.id || dept.slug}
                    onClick={() => { setSelectedDept(dept.id || dept.slug); handleNext(); }}
                    className={clsx(
                      "p-4 md:p-6 rounded-2xl text-left border transition-all hover:border-emerald-teal/50 group",
                      (selectedDept === dept.id || selectedDept === dept.slug) ? "border-emerald-deep bg-emerald-soft/30 shadow-sm" : "border-gray-100 bg-white"
                    )}
                  >
                    <div className="mb-2 md:mb-3">
                      <IconRenderer name={dept.icon} className="w-8 h-8 md:w-10 md:h-10 text-emerald-teal group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-semibold text-emerald-deep text-sm md:text-base mb-1">{dept.name}</h3>
                    <p className="text-[11px] md:text-xs text-text-muted leading-tight line-clamp-2">{dept.shortDescription}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Doctor */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl md:text-3xl font-serif text-emerald-deep mb-2">Choose Doctor</h2>
            <p className="text-sm md:text-base text-text-muted mb-6 md:mb-8">Select a specialist from the {department?.name || 'chosen'} department.</p>
            
            {loadingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {Array.from({length: 4}).map((_, i) => (
                  <div key={i} className="p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 bg-gray-50/50 flex gap-3 md:gap-4 animate-pulse">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200 shrink-0"></div>
                    <div className="flex-1 py-1">
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : availableDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {availableDoctors.map(doc => (
                  <button
                    key={doc.id || doc.slug}
                    onClick={() => { setSelectedDoc(doc.id || doc.slug); handleNext(); }}
                    className={clsx(
                      "p-3 md:p-4 rounded-xl md:rounded-2xl text-left border transition-all hover:border-emerald-teal/50 flex gap-3 md:gap-4 items-center sm:items-start",
                      (selectedDoc === doc.id || selectedDoc === doc.slug) ? "border-emerald-deep bg-emerald-soft/30 shadow-sm" : "border-gray-100 bg-white"
                    )}
                  >
                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 bg-emerald-soft">
                      {doc.photo ? (
                        <Image src={doc.photo} alt={doc.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-emerald-deep font-bold text-lg">
                          {doc.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-emerald-deep text-sm md:text-base">{doc.name}</h3>
                      <p className="text-[11px] md:text-sm text-emerald-teal font-medium mb-0.5 md:mb-1">{doc.specialization}</p>
                      <p className="text-[10px] md:text-xs text-text-muted">{doc.experience}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl flex flex-col items-center">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>No doctors are currently available in this department.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Date */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl md:text-3xl font-serif text-emerald-deep mb-2">Choose Date</h2>
            <p className="text-text-muted mb-6 md:mb-8 text-sm md:text-base">When would you like to see {doctor?.name}?</p>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-3">
              {availableDates.map(date => {
                const isOff = date.getDay() === 0;
                return (
                  <button
                    key={date.toISOString()}
                    disabled={isOff}
                    onClick={() => { setSelectedDate(date); handleNext(); }}
                    className={clsx(
                      "p-2 md:p-4 rounded-xl md:rounded-2xl text-center border md:border-2 transition-all",
                      isOff ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-100" :
                      selectedDate?.getTime() === date.getTime() ? "border-emerald-deep bg-emerald-deep text-white shadow-md" : "border-gray-100 bg-white hover:border-emerald-teal/50 text-emerald-deep"
                    )}
                  >
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider mb-1 font-semibold opacity-80">{format(date, 'EEE')}</span>
                    <span className="block text-xl md:text-2xl font-serif">{format(date, 'd')}</span>
                    <span className="block text-[10px] md:text-xs mt-1 opacity-80">{format(date, 'MMM')}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Time */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl md:text-3xl font-serif text-emerald-deep mb-2">Choose Time</h2>
            <p className="text-text-muted mb-6 md:mb-8 text-sm md:text-base">
              Select an available time slot for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}.
            </p>
            
            {isLoadingSlots ? (
              <div className="py-12 flex flex-col items-center justify-center text-text-muted gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-teal" />
                <p className="text-sm">Checking live availability...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4">
                {timeSlots.map(time => {
                  const isBooked = bookedSlots.includes(time);
                  return (
                    <button
                      key={time}
                      disabled={isBooked}
                      onClick={() => { setSelectedTime(time); handleNext(); }}
                      className={clsx(
                        "p-3 md:p-4 rounded-xl md:rounded-2xl text-center border md:border-2 transition-all text-sm md:text-base font-medium flex items-center justify-center gap-2",
                        isBooked 
                          ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 line-through text-gray-400" 
                          : selectedTime === time 
                          ? "border-emerald-deep bg-emerald-deep text-white shadow-md" 
                          : "border-gray-100 bg-white hover:border-emerald-teal/50 text-emerald-deep"
                      )}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{time}</span>
                      {isBooked && <span className="text-[10px] uppercase font-bold ml-1 text-red-500 no-underline">(Booked)</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Details */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-serif text-emerald-deep mb-2">Patient Details</h2>
            <p className="text-text-muted mb-8">Please provide your contact and personal information.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-emerald-deep mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal"
                  placeholder="John Doe"
                  value={patientDetails.name}
                  onChange={e => setPatientDetails({...patientDetails, name: e.target.value})}
                />
              </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-deep mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal"
                      placeholder="7889XXXXX"
                      value={patientDetails.phone}
                      onChange={e => setPatientDetails({...patientDetails, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-deep mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="xyz@gmail.com"
                      value={patientDetails.email}
                      disabled={!!currentUser}
                      onChange={e => setPatientDetails({...patientDetails, email: e.target.value})}
                    />
                  </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-emerald-deep mb-2">Age</label>
                  <input 
                    type="number" 
                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal"
                    placeholder="30"
                    value={patientDetails.age}
                    onChange={e => setPatientDetails({...patientDetails, age: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-emerald-deep mb-2">Gender</label>
                  <select 
                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal bg-white"
                    value={patientDetails.gender}
                    onChange={e => setPatientDetails({...patientDetails, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-emerald-deep mb-2">Additional Message (Optional)</label>
                <textarea 
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal"
                  rows={3}
                  placeholder="Any symptoms or notes for the doctor..."
                  value={patientDetails.message}
                  onChange={e => setPatientDetails({...patientDetails, message: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!patientDetails.name || !patientDetails.phone}
              className="mt-8 bg-emerald-deep text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review Appointment
            </button>
          </div>
        )}

        {/* Step 6: Review */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-serif text-emerald-deep mb-2">Review & Confirm</h2>
            <p className="text-text-muted mb-8">Please check your appointment details before confirming.</p>
            
            <div className="bg-emerald-soft/30 rounded-3xl p-8 border border-emerald-teal/20 mb-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Appointment</h4>
                  <p className="text-lg font-serif text-emerald-deep font-medium flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-emerald-teal" />
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-lg font-serif text-emerald-deep font-medium flex items-center gap-2 mt-1">
                    <Clock className="w-5 h-5 text-emerald-teal" />
                    {selectedTime}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Doctor & Department</h4>
                  <div className="flex items-center gap-4">
                    {doctor && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <Image src={doctor.photo} alt={doctor.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-emerald-deep">{doctor?.name}</p>
                      <p className="text-sm text-text-muted">{department?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-px bg-emerald-teal/20 hidden md:block"></div>
              
              <div className="flex-1 space-y-4">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Patient Info</h4>
                <div className="flex items-center gap-3 text-emerald-deep font-medium">
                  <User className="w-4 h-4 text-emerald-teal" />
                  {patientDetails.name} ({patientDetails.age}, {patientDetails.gender})
                </div>
                <div className="flex items-center gap-3 text-emerald-deep font-medium">
                  <Phone className="w-4 h-4 text-emerald-teal" />
                  {patientDetails.phone}
                </div>
                {patientDetails.email && (
                  <div className="flex items-center gap-3 text-emerald-deep font-medium">
                    <Mail className="w-4 h-4 text-emerald-teal" />
                    {patientDetails.email}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full md:w-auto bg-emerald-deep text-white px-12 py-4 rounded-full font-semibold hover:bg-emerald-teal transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Confirming...
                </span>
              ) : "Confirm Appointment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <main className="flex flex-col w-full pb-24">
      <section className="bg-ivory-warm py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif text-emerald-deep mb-6">Book an Appointment</h1>
          <p className="text-lg text-text-muted">
            Follow the simple steps to schedule your visit. If you need urgent assistance, please call us directly.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <Suspense fallback={<div className="h-[600px] flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-soft border-t-emerald-teal rounded-full animate-spin"></div></div>}>
          <AppointmentForm />
        </Suspense>
      </section>
    </main>
  );
}
