"use client";

import { useState, useEffect, use } from "react";
import { auth } from "@/firebase/config";
import { getAppointment, Appointment } from "@/firebase/db";
import { onAuthStateChanged } from "firebase/auth";
import { Printer, ChevronLeft, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [loading, setLoading] = useState(true);
  const [apt, setApt] = useState<Appointment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser?.email) {
        setError("Unauthorized. Please log in first.");
        setLoading(false);
        return;
      }
      
      try {
        const data = await getAppointment(id);
        if (!data) {
          setError("Receipt not found.");
        } else if (data.patientEmail !== currentUser.email) {
          setError("Unauthorized access.");
        } else {
          setApt(data);
        }
      } catch(e) {
        setError("Error loading receipt.");
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-emerald-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !apt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl font-fredoka text-emerald-deep mb-4">{error}</p>
        <Link href="/patient" className="text-emerald-teal hover:underline font-sans">Return to Portal</Link>
      </div>
    );
  }

  const bookingDate = apt.createdAt 
    ? new Date(apt.createdAt).toLocaleDateString()
    : "N/A";
  const downloadDate = new Date().toLocaleDateString();
  const tokenNumber = apt.id?.slice(0, 8).toUpperCase();
  const docName = apt.doctorName ? (apt.doctorName.toLowerCase().startsWith('dr.') ? apt.doctorName : `Dr. ${apt.doctorName}`) : 'Any Available';

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white flex flex-col items-center py-10 print:py-0 px-4 print:px-0 font-sans">
      
      {/* Non-Printable Actions Container */}
      <div className="flex w-full justify-between items-center print:hidden max-w-2xl mb-6">
        <Link href="/patient" className="flex items-center gap-2 text-gray-600 hover:text-emerald-teal transition-colors font-oswald uppercase tracking-wider text-sm bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-200">
          <ChevronLeft className="w-4 h-4" /> Back to Account
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-teal text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-emerald-deep transition-colors font-oswald uppercase tracking-wider text-sm"
        >
          <Printer className="w-4 h-4" /> Download / Print
        </button>
      </div>

      {/* Printable Receipt Paper */}
      <div className="bg-white w-full max-w-2xl print:max-w-none print:w-full print:border-none print:shadow-none p-10 md:p-14 shadow-xl border border-gray-200 relative overflow-hidden receipt-paper">
         
         {/* Background Watermark with Circular Mask */}
         <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none grayscale z-0">
           <div className="w-[400px] h-[400px] rounded-full overflow-hidden flex items-center justify-center bg-transparent">
             <Image src="/logo.png" alt="Watermark" width={300} height={300} className="object-contain mix-blend-multiply" />
           </div>
         </div>

         <div className="relative z-10">
           {/* Header */}
           <div className="flex justify-between items-start border-b-2 border-emerald-teal/20 pb-8 mb-8">
             <div>
               <div className="flex items-center gap-3 mb-4">
                  <Image src="/logo.png" alt="Haya Wellness" width={48} height={48} className="w-12 h-12" />
                  <span className="text-3xl font-fredoka text-emerald-deep">Haya Wellness</span>
               </div>
               <div className="text-xs text-gray-500 space-y-1 font-sans">
                 <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 123 Healing Avenue, Wellness District</p>
                 <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> +1 (555) 123-4567</p>
                 <p className="flex items-center gap-1"><Mail className="w-3 h-3" /> support@hayawellness.com</p>
               </div>
             </div>
             
             <div className="text-right">
               <h1 className="text-4xl font-oswald text-emerald-teal uppercase tracking-widest mb-2">Receipt</h1>
               <p className="text-xs font-sans text-gray-500 font-medium">Token No: <span className="text-gray-800">{tokenNumber}</span></p>
               <p className="text-xs font-sans text-gray-500 font-medium mt-1">Downloaded: <span className="text-gray-800">{downloadDate}</span></p>
             </div>
           </div>

           {/* Patient Details & Status */}
           <div className="grid grid-cols-2 gap-8 mb-10">
             <div>
               <h3 className="text-xs font-oswald uppercase tracking-widest text-emerald-teal mb-2">Patient Details</h3>
               <p className="text-lg font-fredoka text-emerald-deep">{apt.patientName}</p>
               <p className="text-sm text-gray-600 mt-1">{apt.patientEmail}</p>
               <p className="text-sm text-gray-600">{apt.patientPhone}</p>
               <p className="text-sm text-gray-600 mt-1">
                 {apt.patientAge ? `Age: ${apt.patientAge}` : ''} 
                 {apt.patientAge && apt.patientGender ? ' | ' : ''}
                 {apt.patientGender ? `Gender: ${apt.patientGender}` : ''}
               </p>
             </div>
             <div className="bg-emerald-soft/50 p-4 rounded-xl border border-emerald-teal/10">
               <h3 className="text-xs font-oswald uppercase tracking-widest text-emerald-teal mb-2">Booking Info</h3>
               <p className="text-sm text-gray-600 mb-1">Status: <span className="font-medium text-emerald-deep uppercase">{apt.status}</span></p>
               <p className="text-sm text-gray-600 mb-1">Booked On: <span className="font-medium text-gray-800">{bookingDate}</span></p>
               <p className="text-sm text-gray-600">Payment Mode: <span className="font-medium text-gray-800">Offline</span></p>
             </div>
           </div>

           {/* Appointment Details Table */}
           <h3 className="text-xs font-oswald uppercase tracking-widest text-emerald-teal mb-3">Appointment Details</h3>
           <div className="border border-gray-200 rounded-xl overflow-hidden mb-10">
             <table className="w-full text-left text-sm font-sans">
               <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                   <th className="px-4 py-3 font-medium text-gray-600">Department</th>
                   <th className="px-4 py-3 font-medium text-gray-600">Doctor</th>
                   <th className="px-4 py-3 font-medium text-gray-600 text-right">Appt Date & Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 <tr>
                   <td className="px-4 py-4 font-medium text-emerald-deep">
                     {apt.departmentId.replace(/-/g, ' ')}
                   </td>
                   <td className="px-4 py-4 text-gray-600">
                     {docName}
                   </td>
                   <td className="px-4 py-4 text-right text-gray-600">
                     <p className="font-medium">{apt.date}</p>
                     <p className="text-xs">{apt.time}</p>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>

           {/* Footer */}
           <div className="text-center pt-8 border-t border-gray-200">
             <p className="text-lg font-fredoka text-emerald-deep mb-1">Thank you for choosing Haya Wellness.</p>
             <p className="text-xs text-gray-500 font-sans">Please present this receipt token upon arrival at the reception.</p>
           </div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .receipt-paper { box-shadow: none !important; border: none !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
      `}} />
    </div>
  );
}
