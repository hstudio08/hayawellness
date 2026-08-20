"use client";

import jsPDF from 'jspdf';
import { format } from 'date-fns';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref") || "HAYA-000000";
  const timeStr = searchParams.get("time") || "TBD";
  const dateStr = searchParams.get("date");
  const doctorName = searchParams.get("doc") || "Doctor";
  const deptName = searchParams.get("dept") || "Department";
  const patientName = searchParams.get("patient") || "Patient";
  
  
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(6, 78, 59); // emerald-deep
    doc.text('Haya Wellness Centre', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Appointment Confirmation', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Reference ID: ${refId}`, 20, 50);
    doc.text(`Patient Name: ${patientName}`, 20, 60);
    doc.text(`Doctor: ${doctorName}`, 20, 70);
    doc.text(`Department: ${deptName}`, 20, 80);
    
    const displayDate = dateStr ? format(new Date(dateStr), 'EEEE, MMMM d, yyyy') : 'TBD';
    doc.text(`Date: ${displayDate}`, 20, 90);
    doc.text(`Time: ${timeStr}`, 20, 100);
    
    doc.text('Please arrive 10 minutes before your scheduled time.', 20, 120);
    
    doc.save(`Haya_Appointment_${refId}.pdf`);
  };

  

  return (
    <div className="bg-white rounded-3xl p-10 md:p-16 text-center max-w-2xl mx-auto shadow-xl shadow-emerald-deep/5 border border-gray-100 mt-16 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-emerald-soft rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-12 h-12 text-emerald-teal" />
      </div>
      
      <h1 className="text-4xl font-serif text-emerald-deep mb-4">Your appointment is confirmed.</h1>
      <p className="text-lg text-text-muted mb-8">
        Thank you for choosing Haya Wellness Centre. We have received your booking and will send a confirmation message shortly.
      </p>

      <div className="bg-ivory-warm p-6 rounded-2xl border border-gray-200 mb-10">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">Booking Reference</span>
        <span className="text-2xl font-mono text-emerald-deep font-bold mb-4 block">{refId}</span>
        
        <div className="text-left bg-white/50 p-4 rounded-xl space-y-2 mt-4 text-sm text-emerald-deep">
          <p><strong>Patient:</strong> {patientName}</p>
          <p><strong>Doctor:</strong> {doctorName} ({deptName})</p>
          <p><strong>Date:</strong> {dateStr ? format(new Date(dateStr), 'EEEE, MMMM d, yyyy') : 'TBD'}</p>
          <p><strong>Time:</strong> {timeStr}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={handleDownload} className="bg-white border border-emerald-teal text-emerald-deep px-8 py-4 rounded-full font-semibold hover:bg-emerald-soft transition-colors flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          Download PDF Receipt
        </button>
        <Link href="/" className="bg-emerald-deep text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-teal transition-colors flex items-center justify-center gap-2 group">
          Back to Home
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function AppointmentSuccessPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-ivory-warm pb-24">
      <div className="px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
