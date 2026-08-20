"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { DEPARTMENTS, DOCTORS } from "@/data/mockData";

// Parse time string like '10:00 AM - 02:00 PM' and generate 30m slots
function generateTimeSlots(timingStr = '09:00 AM - 05:00 PM', slotsCount = 10) {
  try {
    const parts = timingStr.split('-');
    if (parts.length < 2) throw new Error();
    
    // Very naive generator for UI sake
    return ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].slice(0, slotsCount) || ['10:00 AM'];
  } catch(e) {
    return ['09:00 AM', '09:30 AM', '10:00 AM'];
  }
}
\nimport { addDays, format, isBefore, startOfToday } from "date-fns";
import { CheckCircle2, ChevronLeft, Calendar as CalendarIcon, Clock, User, Phone, Mail, AlertCircle } from "lucide-react";
import clsx from "clsx";

import { IconRenderer } from "@/components/ui/IconRenderer";

function AppointmentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialDept = searchParams.get("department");
  const initialDoc = searchParams.get("doctor");

  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState<string | null>(initialDept);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(initialDoc);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientDetails, setPatientDetails] = useState({
    name: "", email: "", phone: "", age: "", gender: "Male", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If a doctor is passed initially, auto-select their department
  useEffect(() => {
    if (initialDoc) {
      const doc = DOCTORS.find(d => d.id === initialDoc);
      if (doc) {
        setSelectedDept(doc.departmentId);
        setSelectedDoc(doc.id);
        setStep(3); // Jump to date selection
      }
    } else if (initialDept) {
      setSelectedDept(initialDept);
      setStep(2); // Jump to doctor selection
    }
  }, [initialDoc, initialDept]);

  const availableDoctors = selectedDept ? DOCTORS.filter(d => d.departmentId === selectedDept) : DOCTORS;
  const doctor = selectedDoc ? DOCTORS.find(d => d.id === selectedDoc) : null;
  const department = selectedDept ? DEPARTMENTS.find(d => d.id === selectedDept) : null;

  // Mock available time slots
  const timeSlots = generateTimeSlots(doctor?.timings, doctor?.slots || 10);

  // Mock next 14 days
  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i + 1));

  const handleNext = () => setStep(s => Math.min(s + 1, 6));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleConfirm = async () => {
    setIsSubmitting(true);
    // Simulate API call to check for double booking and save
    await new Promise(r => setTimeout(r, 1500));
    // Check if slot is taken (Random simulation)
    if (Math.random() > 0.9) {
      alert("That time was just booked. Please choose another time.");
      setStep(4);
      setIsSubmitting(false);
      return;
    }
    
    // Redirect to success
    router.push(`/appointment/success?ref=HAYA-${Math.floor(100000 + Math.random() * 900000)}&time=${encodeURIComponent(selectedTime)}&date=${selectedDate ? encodeURIComponent(selectedDate.toISOString()) : ''}&doc=${encodeURIComponent(doctor?.name || '')}&dept=${encodeURIComponent(department?.name || '')}&patient=${encodeURIComponent(patientDetails.name)}`);
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
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => { setSelectedDept(dept.id); handleNext(); }}
                  className={clsx(
                    "p-4 md:p-6 rounded-2xl text-left border transition-all hover:border-emerald-teal/50 group",
                    selectedDept === dept.id ? "border-emerald-deep bg-emerald-soft/30 shadow-sm" : "border-gray-100 bg-white"
                  )}
                >
                  <div className="mb-2 md:mb-3">
                    <IconRenderer name={dept.icon} className="w-8 h-8 md:w-10 md:h-10 text-emerald-teal group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-semibold text-emerald-deep text-sm md:text-base mb-1">{dept.name}</h3>
                  <p className="text-[11px] md:text-xs text-text-muted leading-tight">{dept.shortDescription}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Doctor */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl md:text-3xl font-serif text-emerald-deep mb-2">Choose Doctor</h2>
            <p className="text-sm md:text-base text-text-muted mb-6 md:mb-8">Select a specialist from the {department?.name} department.</p>
            
            {availableDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {availableDoctors.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => { setSelectedDoc(doc.id); handleNext(); }}
                    className={clsx(
                      "p-3 md:p-4 rounded-xl md:rounded-2xl text-left border transition-all hover:border-emerald-teal/50 flex gap-3 md:gap-4 items-center sm:items-start",
                      selectedDoc === doc.id ? "border-emerald-deep bg-emerald-soft/30 shadow-sm" : "border-gray-100 bg-white"
                    )}
                  >
                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0">
                      <Image src={doc.photo} alt={doc.name} fill className="object-cover" />
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
                // Simulate weekends or doctor days off (e.g. Sundays off)
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
            <p className="text-text-muted mb-6 md:mb-8 text-sm md:text-base">Select an available time slot for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4">
              {timeSlots.map(time => {
                // Randomly disable some slots for demo purposes
                const isBooked = Math.random() > 0.8;
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => { setSelectedTime(time); handleNext(); }}
                    className={clsx(
                      "p-3 md:p-4 rounded-xl md:rounded-2xl text-center border md:border-2 transition-all text-sm md:text-base font-medium flex items-center justify-center gap-2",
                      isBooked ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-100 line-through text-gray-500" :
                      selectedTime === time ? "border-emerald-deep bg-emerald-deep text-white shadow-md" : "border-gray-100 bg-white hover:border-emerald-teal/50 text-emerald-deep"
                    )}
                  >
                    <Clock className="w-4 h-4" />
                    {time}
                  </button>
                )
              })}
            </div>
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
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-teal"
                  placeholder="xyz@gmail.com"
                  value={patientDetails.email}
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
