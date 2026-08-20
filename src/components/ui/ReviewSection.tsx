"use client";
import { useState } from "react";
const REVIEWS = [
  { name: "Ahmed K.", text: "The doctors at Haya Wellness Centre are incredibly professional and compassionate. My surgery went perfectly.", role: "Orthopedics Patient" },
  { name: "Fatima S.", text: "I have never seen such a beautifully designed and calming hospital. The pediatric team took such great care.", role: "Pediatrics Patient" },
  { name: "Rajesh M.", text: "A truly world-class facility right here in the city. Swift diagnosis and exceptional follow-up care.", role: "Cardiology Patient" },
  { name: "Sara L.", text: "From the front desk to the consulting room, everything was seamless and incredibly comforting.", role: "Neurology Patient" },
  { name: "Vikram P.", text: "Highly experienced specialists. The facilities are modern and the nursing staff is very attentive.", role: "General Surgery" },
  { name: "Amina J.", text: "A haven for healing. I felt completely at ease during my entire treatment process.", role: "Oncology Patient" },
  { name: "David W.", text: "Best medical experience I've had. Clean, professional, and they truly care about your recovery.", role: "Orthopedics Patient" },
  { name: "Priya R.", text: "The dermatology department is excellent. They listened to my concerns and provided an effective treatment.", role: "Dermatology" },
  { name: "Michael T.", text: "State-of-the-art diagnostic center. Got my results quickly and the doctor explained everything clearly.", role: "Internal Medicine" },
  { name: "Zainab H.", text: "So grateful for the emergency care team. They acted fast and saved my life. Thank you Haya Wellness!", role: "Emergency Care" },
];
export function ReviewSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? REVIEWS : REVIEWS.slice(0, 6);
  return (
    <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 lg:px-8 w-full bg-ivory-warm/30 mt-12 rounded-[3rem]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-emerald-teal uppercase tracking-widest mb-4 block">Patient Feedback</span>
          <h2 className="text-4xl md:text-5xl font-serif text-emerald-deep leading-tight">Hear from our patients</h2>
        </div>
      </div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {REVIEWS.map((review, idx) => {
          // If not showAll, items beyond index 2 are hidden on mobile.
          // Items beyond index 5 are totally hidden.
          const isHiddenMobile = !showAll && idx >= 3;
          const isHiddenTotal = !showAll && idx >= 6;
          
          if (isHiddenTotal) return null;

          return (
            <div key={idx} className={`break-inside-avoid bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all border border-emerald-soft/50 flex flex-col justify-between ${isHiddenMobile ? 'hidden md:flex' : 'flex'}`}>
              <div>
                <div className="flex gap-1 text-gold-subtle mb-4 text-sm">
                  {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                </div>
                <p className="text-text-muted text-sm italic mb-6 leading-relaxed">"{review.text}"</p>
              </div>
              <div className="flex items-center gap-3 border-t border-emerald-soft/50 pt-4">
                <div className="w-10 h-10 bg-emerald-soft text-emerald-teal rounded-full flex items-center justify-center font-bold text-sm border border-emerald-teal/20">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-deep text-sm">{review.name}</h4>
                  <p className="text-[11px] text-text-muted">{review.role}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!showAll && (
        <div className="mt-12 text-center">
          <button onClick={() => setShowAll(true)} className="bg-white text-emerald-deep px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider border-2 border-emerald-deep/10 hover:border-emerald-teal hover:bg-white transition-all shadow-sm hover:shadow-md cursor-pointer">
            View More Reviews
          </button>
        </div>
      )}
    </section>
  );
}
