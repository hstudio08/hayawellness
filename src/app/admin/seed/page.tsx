"use client";

import { useState } from "react";
import { db } from "@/firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const DUMMY_DEPTS = [
  { name: "Cardiology", slug: "cardiology", shortDescription: "Heart & Vascular Care", fullDescription: "Comprehensive care for heart conditions, including advanced diagnostics, interventional cardiology, and preventative screening.", icon: "Activity", image: "https://images.unsplash.com/photo-1504439468489-c8920d786a2b?w=800&q=80" },
  { name: "Neurology", slug: "neurology", shortDescription: "Brain & Nervous System", fullDescription: "Expert diagnosis and treatment for neurological disorders, stroke prevention, and brain health.", icon: "Brain", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80" },
  { name: "Orthopedics", slug: "orthopedics", shortDescription: "Bone & Joint Health", fullDescription: "Specialized care for bones, joints, ligaments, tendons, and muscles.", icon: "Activity", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80" },
  { name: "Pediatrics", slug: "pediatrics", shortDescription: "Child Healthcare", fullDescription: "Comprehensive healthcare for infants, children, and adolescents.", icon: "Activity", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80" },
  { name: "Dermatology", slug: "dermatology", shortDescription: "Skin, Hair & Nails", fullDescription: "Advanced treatments for all skin, hair, and nail conditions.", icon: "Activity", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80" },
  { name: "Ophthalmology", slug: "ophthalmology", shortDescription: "Eye Care", fullDescription: "Complete eye care services including surgeries and vision correction.", icon: "Eye", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80" },
  { name: "Dental", slug: "dental", shortDescription: "Dental Care", fullDescription: "Comprehensive dental services from routine checkups to complex oral surgeries.", icon: "Activity", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80" },
  { name: "ENT", slug: "ent", shortDescription: "Ear, Nose & Throat", fullDescription: "Specialized care for ear, nose, throat, and related structures of the head and neck.", icon: "Activity", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" },
  { name: "Psychiatry", slug: "psychiatry", shortDescription: "Mental Health", fullDescription: "Expert mental health care, counseling, and psychiatric treatments.", icon: "Brain", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" },
  { name: "General Surgery", slug: "general-surgery", shortDescription: "Surgical Procedures", fullDescription: "A wide range of surgical procedures performed by expert surgeons.", icon: "Activity", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80" }
];

const DOCTOR_NAMES = ["Dr. Aamir Khan", "Dr. Sarah Ahmed", "Dr. Rajesh Sharma", "Dr. Emily Chen", "Dr. Michael Brown", "Dr. Fatima Ali", "Dr. David Smith", "Dr. Priya Patel", "Dr. John Doe", "Dr. Jane Roe", "Dr. Omar Farooq", "Dr. Zainab Hassan", "Dr. Ali Raza", "Dr. Noor Jahan", "Dr. Bilal Tariq"];
const DOCTOR_PICS = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80"
];

export default function SeedPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const handleSeed = async () => {
    
    
    setLoading(true);
    setLog([]);
    
    try {
      addLog("Starting database seed...");
      
      // 1. Seed Departments
      const deptIds: string[] = [];
      for (const dept of DUMMY_DEPTS) {
        const docRef = await addDoc(collection(db, "departments"), {
          ...dept,
          isActive: true,
          createdAt: new Date()
        });
        deptIds.push(docRef.id);
        addLog(`Added department: ${dept.name}`);
      }
      
      // 2. Seed Doctors
      for (let i = 0; i < 15; i++) {
        const name = DOCTOR_NAMES[i] || `Dr. Dummy ${i}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const randDeptId = deptIds[i % deptIds.length]; // cycle through depts
        const photo = DOCTOR_PICS[i % DOCTOR_PICS.length];
        
        await addDoc(collection(db, "doctors"), {
          name,
          slug,
          departmentId: randDeptId,
          specialization: "Specialist Consultant",
          qualifications: ["MBBS", "MD", "Fellowship"],
          experience: `${Math.floor(Math.random() * 20) + 5} Years`,
          bio: `${name} is a highly experienced specialist dedicated to providing the best patient care. This is a dummy profile generated for demonstration.`,
          photo: photo,
          availability: "Available",
          slots: 10,
          timings: "10:00 AM - 04:00 PM",
          isActive: true,
          createdAt: new Date()
        });
        addLog(`Added doctor: ${name}`);
      }
      
      addLog("Seeding completed successfully! You can safely delete this page later.");
    } catch (error: any) {
      addLog(`ERROR: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/dashboard" className="flex items-center text-emerald-teal mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>
      
      <h1 className="text-3xl font-serif text-emerald-deep mb-4">Database Seeder Tool</h1>
      <p className="mb-6 text-gray-600">This tool will inject 10 dummy departments and 15 dummy doctors into your live Firebase database. Only click this if your database is empty or you want to add mock data!</p>
      
      <button 
        onClick={handleSeed}
        disabled={loading}
        className="bg-emerald-deep text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-teal disabled:opacity-50"
      >
        {loading ? "Seeding..." : "Inject Dummy Data"}
      </button>
      
      <div className="mt-8 bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
        {log.length === 0 ? "Ready..." : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
