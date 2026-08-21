"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { getAppointment, Appointment } from "@/firebase/db";

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [apt, setApt] = useState<Appointment | null>(null);

  useEffect(() => {
    if (id) {
      getAppointment(id).then(data => setApt(data));
    }
  }, [id]);

  return (
    <div className="bg-white rounded-3xl p-10 md:p-16 text-center max-w-2xl mx-auto shadow-xl shadow-emerald-deep/5 border border-gray-100 mt-16 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-emerald-soft rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-12 h-12 text-emerald-teal" />
      </div>
      
      <h1 className="text-4xl font-serif text-emerald-deep mb-4">Your appointment is confirmed.</h1>
      <p className="text-lg text-text-muted mb-8">
        Thank you for choosing Haya Wellness Centre. We have received your booking and it is currently pending review.
      </p>

      {apt && (
        <div className="bg-ivory-warm p-6 rounded-2xl border border-gray-200 mb-10">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">Booking Token</span>
          <span className="text-2xl font-mono text-emerald-deep font-bold mb-4 block">{id?.slice(0, 8).toUpperCase()}</span>
          
          <div className="text-left bg-white/50 p-4 rounded-xl space-y-2 mt-4 text-sm text-emerald-deep">
            <p><strong>Patient:</strong> {apt.patientName}</p>
            <p><strong>Doctor:</strong> {apt.doctorName} ({apt.departmentId.replace(/-/g, ' ')})</p>
            <p><strong>Date:</strong> {apt.date}</p>
            <p><strong>Time:</strong> {apt.time}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {id && (
          <Link 
            href={`/patient/receipt/${id}`}
            target="_blank"
            className="bg-white border border-emerald-teal text-emerald-deep px-8 py-4 rounded-full font-semibold hover:bg-emerald-soft transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Download Receipt
          </Link>
        )}
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
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-emerald-teal border-t-transparent rounded-full animate-spin"></div></div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
