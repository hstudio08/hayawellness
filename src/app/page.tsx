"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Activity, Calendar as CalendarIcon, Phone, Play, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { BLOGS } from "@/data/mockData";
import { getDoctors, getDepartments, Doctor, Department } from "@/firebase/db";
import { IconRenderer } from "@/components/ui/IconRenderer";
import ShinyText from "@/components/ui/ShinyText";
import { ReviewSection } from "@/components/ui/ReviewSection";
import { useState, useEffect } from "react";

export default function Home() {
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const [featuredDepartments, setFeaturedDepartments] = useState<Department[]>([]);
  const [showAllInsta, setShowAllInsta] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [docs, depts] = await Promise.all([getDoctors(), getDepartments()]);
      setFeaturedDoctors(docs.filter(d => d.isActive).slice(0, 6));
      setFeaturedDepartments(depts.filter(d => d.isActive).slice(0, 15));
    }
    fetchData();
  }, []);

  return (
    <main className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative flex bg-ivory-warm overflow-hidden pb-32 pt-8 md:pt-12 lg:pt-16 min-h-[85vh]">
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-0 opacity-40 mix-blend-multiply" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)', maskImage: 'linear-gradient(to right, transparent, black 30%)' }}>
          <Image 
            src="https://res.cloudinary.com/dislib3k/image/upload/v1787240170/c1027157-fbcb-4a9c-979f-84180e6c0132.png"
            alt="Haya Wellness Medical Experts"
            fill
            priority
            className="object-cover lg:object-contain object-right-top"
          />
        </div>
        {/* Stronger gradient fade for mobile visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-warm via-ivory-warm/90 to-ivory-warm/30 lg:via-transparent lg:to-transparent z-0 pointer-events-none"></div>
        
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col lg:flex-row items-start justify-between gap-12">
          
          {/* Left Text */}
          <div className="flex-1 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-2xl pt-2 lg:pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-emerald-deep/10 shadow-sm transition-transform hover:scale-105 cursor-default mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-teal animate-pulse"></span>
              <ShinyText text="Top Rated Hospital" disabled={false} speed={3} className="font-semibold text-emerald-deep uppercase tracking-wider text-[10px]" color="#155A4B" shineColor="#C9A44C" />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold text-emerald-deep mb-8 leading-[1.05] tracking-tight">
              Your health in caring hands at <br className="hidden md:block"/>
              <span className="relative inline-block text-emerald-teal">
                Haya Wellness Centre
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold-subtle opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-muted mb-3 max-w-lg leading-snug font-medium">
              <ShinyText text="Immediate care when you need it most." disabled={false} speed={4} className="block" color="#63756F" shineColor="#197565" />
              Complete care for your whole family.
            </p>
            <p className="text-base text-text-muted mb-10 max-w-lg leading-relaxed">
              Serving our community with excellence and compassion.
            </p>

            {/* CTA Buttons - Normal flow on mobile, Absolute right on desktop */}
            <div className="lg:absolute lg:bottom-24 xl:bottom-32 lg:right-8 xl:right-16 z-20 flex flex-col sm:flex-row flex-wrap gap-4 mt-6 lg:mt-0 lg:justify-end animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              <Link 
                href="/appointment"
                className="bg-emerald-deep text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-bold uppercase tracking-wider hover:bg-emerald-teal transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group border border-emerald-teal"
              >
                Book an Appointment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/doctors"
                className="bg-white/90 backdrop-blur-md text-emerald-deep px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-bold uppercase tracking-wider border-2 border-emerald-deep hover:border-emerald-teal hover:bg-emerald-soft transition-all flex items-center justify-center gap-2 hover:-translate-y-1 shadow-xl"
              >
                Find a Doctor
              </Link>
            </div>
          </div>
          
          {/* Right Floating Elements */}
          <div className="w-full lg:w-auto animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 mt-4 lg:mt-24 flex flex-col items-start sm:items-end gap-8 relative xl:pr-12 pointer-events-none">
            
            {/* Statistics Small Edge Cards */}
            <div className="flex sm:flex-col gap-3 w-full sm:w-48 pointer-events-auto lg:absolute lg:-right-4 xl:-right-12">
              <div className="flex-1 sm:flex-none bg-emerald-deep p-4 rounded-xl border border-gold-subtle shadow-xl text-white hover:-translate-y-1 transition-transform flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-gold-subtle" />
                </div>
                <div>
                  <span className="block text-2xl font-serif leading-none">15<span className="text-sm text-gold-subtle">+</span></span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-soft/80 mt-1 block">Specialities</span>
                </div>
              </div>
              <div className="flex-1 sm:flex-none bg-emerald-deep p-4 rounded-xl border border-gold-subtle shadow-xl text-white hover:-translate-y-1 transition-transform flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <IconRenderer name="Users" className="w-5 h-5 text-gold-subtle" />
                </div>
                <div>
                  <span className="block text-2xl font-serif leading-none">10k<span className="text-sm text-gold-subtle">+</span></span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-soft/80 mt-1 block">Patients</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 lg:px-8 -mt-20 w-full mb-12">
        <div className="bg-white rounded-3xl lg:rounded-[3rem] shadow-xl p-2 md:p-3 flex flex-col lg:grid lg:grid-cols-4 gap-2 border border-gray-100">
          <Link href="/doctors" className="flex flex-col items-center justify-center py-5 px-4 gap-2 bg-emerald-soft/40 hover:bg-emerald-soft rounded-2xl md:rounded-[2rem] border border-emerald-teal/20 transition-all text-center group">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5 text-emerald-teal" strokeWidth={2} />
            </div>
            <span className="font-semibold text-emerald-deep text-sm md:text-[15px]">Find a Doctor</span>
            <span className="text-[11px] md:text-xs text-emerald-deep/70">Search by department</span>
          </Link>
          
          <Link href="/appointment" className="flex flex-col items-center justify-center py-5 px-4 gap-2 bg-gold-subtle/10 hover:bg-gold-subtle/20 rounded-2xl md:rounded-[2rem] border border-gold-subtle/30 transition-all text-center group">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <CalendarIcon className="w-5 h-5 text-gold-subtle" strokeWidth={2} />
            </div>
            <span className="font-semibold text-emerald-deep text-sm md:text-[15px]">Book Appointment</span>
            <span className="text-[11px] md:text-xs text-emerald-deep/70">Choose a time slot</span>
          </Link>

          <div className="flex flex-col items-center justify-center py-5 px-4 gap-2 bg-rose-50 hover:bg-rose-100 rounded-2xl md:rounded-[2rem] border border-rose-200 transition-all text-center cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <IconRenderer name="Activity" className="w-5 h-5 text-rose-500" />
            </div>
            <span className="font-semibold text-rose-900 text-sm md:text-[15px]">Urgent Help</span>
            <span className="text-[11px] md:text-xs text-rose-700/80">Call 7889XXXXX</span>
          </div>
          
          <Link href="/contact" className="flex flex-col items-center justify-center py-5 px-4 gap-2 bg-blue-50/50 hover:bg-blue-100 rounded-2xl md:rounded-[2rem] border border-blue-200/50 transition-all text-center group">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-blue-500" strokeWidth={2} />
            </div>
            <span className="font-semibold text-blue-900 text-sm md:text-[15px]">Contact Us</span>
            <span className="text-[11px] md:text-xs text-blue-800/70">Get directions</span>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full px-4 lg:px-16 xl:px-24 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 flex flex-col order-2 lg:order-1">
            <span className="text-sm font-semibold text-emerald-teal uppercase tracking-widest mb-4">About Haya Wellness</span>
            <h2 className="text-4xl md:text-5xl font-serif text-emerald-deep mb-6 leading-tight">Healthcare built around you.</h2>
            <div className="w-16 h-1 bg-gold-subtle mb-8 rounded-full"></div>
            
            <p className="text-lg text-text-muted mb-6 leading-relaxed">
              Established in <strong className="text-emerald-deep">2020</strong>, Haya Wellness Centre was founded with a singular motive: to <strong className="text-emerald-deep">redefine the modern clinical experience</strong> by providing world-class medical excellence within an environment of architectural serenity. 
            </p>
            <p className="text-lg text-text-muted mb-10 leading-relaxed">
              Our facility combines <strong className="text-emerald-deep">state-of-the-art diagnostic technology</strong> with highly specialized medical professionals in a space specifically designed to <strong className="text-emerald-deep">alleviate anxiety and promote well-being</strong> for you and your family.
            </p>
            
            <div className="flex items-center gap-6 group cursor-default">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden relative bg-gray-200 group-hover:-translate-x-2 transition-transform">
                  <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop" alt="Doctor" fill className="object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden relative bg-gray-200 group-hover:scale-110 group-hover:z-10 transition-transform">
                  <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" alt="Doctor" fill className="object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden relative bg-gray-200 group-hover:translate-x-2 transition-transform">
                  <Image src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop" alt="Doctor" fill className="object-cover" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-emerald-deep">40+ Specialists</span>
                <span className="text-sm text-text-muted">World-class medical team</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7 order-1 lg:order-2 mb-10 lg:mb-0 relative group">
            <div className="absolute -inset-4 bg-emerald-soft/50 rounded-[3rem] -z-10 transform -rotate-2 transition-transform duration-700 group-hover:rotate-0"></div>
            <div className="aspect-video sm:aspect-[4/3] lg:aspect-[16/10] w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-emerald-deep">
              <Image 
                src="https://res.cloudinary.com/dislib3k/image/upload/v1787244027/9bc482fa-da91-4b04-bc94-6b9efa428cb2.png" 
                alt="Haya Wellness Centre" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl hidden md:flex flex-col gap-2 max-w-[200px] border border-gray-50 transition-transform group-hover:-translate-y-2 group-hover:shadow-2xl duration-500">
              <div className="flex items-center gap-3 text-gold-subtle">
                <span className="text-4xl font-serif leading-none text-emerald-deep">10k<span className="text-2xl text-gold-subtle">+</span></span>
              </div>
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Patients Served</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="bg-emerald-soft/30 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold text-emerald-teal uppercase tracking-widest mb-4 block">Medical Experts</span>
              <h2 className="text-4xl font-serif text-emerald-deep mb-4 leading-tight">Qualified Doctors, Real Results.</h2>
            </div>
            <Link 
              href="/doctors"
              className="bg-white text-emerald-deep px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-teal hover:text-white transition-all shadow-sm flex items-center gap-2 group"
            >
              View all doctors
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {featuredDoctors.map(doctor => (
              <Link key={doctor.id} href={`/doctors/${doctor.slug}`} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 flex flex-col group">
                <div className="relative aspect-square w-full overflow-hidden bg-emerald-soft/20">
                  <Image src={doctor.photo} alt={doctor.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-emerald-deep shadow-md">
                    {doctor.experience}
                  </div>
                </div>
                <div className="p-5 md:p-8 flex-1 flex flex-col bg-white">
                  <h3 className="text-lg md:text-2xl font-serif text-emerald-deep mb-2 group-hover:text-emerald-teal transition-colors line-clamp-1">{doctor.name}</h3>
                  <p className="text-emerald-teal/80 font-semibold text-xs md:text-sm mb-6 line-clamp-1 uppercase tracking-wider">{doctor.specialization}</p>
                  <div className="hidden md:flex items-center gap-2 text-text-muted text-sm border-t border-gray-100 pt-4 mt-auto">
                    <CalendarIcon className="w-4 h-4" /> Available this week
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Preview */}
      <section className="w-full bg-emerald-deep text-white py-24 md:py-32 rounded-[2rem] md:rounded-[3rem] my-12 max-w-[98%] mx-auto relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-teal/20 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold text-emerald-soft uppercase tracking-widest mb-4 block">Medical Departments</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Trusted Care, Complete Recovery.</h2>
              <p className="text-lg text-emerald-soft/80">
                Explore our comprehensive range of medical departments, equipped with advanced technology and staffed by expert specialists.
              </p>
            </div>
            <Link 
              href="/departments"
              className="shrink-0 bg-white text-emerald-deep px-6 py-3 rounded-full text-[13px] md:text-[15px] font-bold uppercase tracking-wide hover:bg-emerald-teal hover:text-white transition-all shadow-lg flex items-center gap-2 group hover:-translate-y-1 hover:shadow-xl"
            >
              All Departments
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-5xl">
            {featuredDepartments.map((dept, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group rounded-2xl shadow-sm hover:shadow-md">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-teal/40 flex items-center justify-center shrink-0 border border-emerald-teal/30 shadow-inner">
                    <IconRenderer name={dept.icon} className="w-6 h-6 text-gold-subtle" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-1 group-hover:text-gold-subtle transition-colors">{dept.name}</h3>
                    <p className="text-emerald-soft/80 text-sm line-clamp-1">{dept.shortDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-5 sm:mt-0 sm:ml-4 shrink-0">
                  <Link href={`/departments/${dept.slug}`} className="text-[13px] font-semibold text-emerald-teal hover:text-white transition-colors flex items-center gap-1 bg-emerald-teal/10 px-3 py-1.5 rounded-full hover:bg-emerald-teal hover:shadow-sm">
                    <Plus className="w-4 h-4" /> Know More
                  </Link>
                  <Link href="/appointment" className="bg-gold-subtle text-emerald-deep px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center md:text-left">
            <Link 
              href="/departments"
              className="inline-flex items-center gap-2 text-gold-subtle hover:text-white text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Explore all 15+ Departments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram / Video Embed Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-12 h-12 bg-emerald-soft rounded-full flex items-center justify-center text-emerald-teal mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-emerald-deep mb-4">Life at Haya Wellness</h2>
          <p className="text-text-muted max-w-2xl">Follow us on Instagram for health tips, behind-the-scenes clinic tours, and patient stories.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "DTnJ4GgAH0G",
            "DKRiV__Prmk",
            "DUVm689EsZB",
            "DXWt6gVkUeU",
            "DXb1KUBEUjE",
            "DcOQU9VPJMX",
            "DcJHVgKRwPI",
            "DbqMHFzPUhj"
          ].map((id, i) => {
            const isHiddenMobile = !showAllInsta && i >= 4;
            const isHiddenTotal = !showAllInsta && i >= 4;
            if (isHiddenTotal) return null;

            return (
              <div key={i} className={`relative aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all ${isHiddenMobile ? 'hidden lg:block' : 'block'}`}>
                <iframe
                  src={`https://www.instagram.com/reel/${id}/embed`}
                  className="w-full h-full border-0 absolute top-0 left-0"
                  scrolling="no"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Instagram Feed / Video Section */}
      <section className="bg-white py-20 w-full overflow-hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center mb-12">
          <span className="text-sm font-semibold text-emerald-teal uppercase tracking-widest mb-4 block">Follow Our Journey</span>
          <h2 className="text-3xl md:text-4xl font-serif text-emerald-deep mb-4 leading-tight">Patient Education & Awareness</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">Watch our doctors share valuable health tips and insights on our Instagram.</p>
        </div>

        <div className="flex w-full overflow-x-auto hide-scrollbar pb-8 px-4 lg:px-8">
          <div className="flex gap-4 md:gap-6 w-max mx-auto">
            {/* Mocking Instagram Reels with Unsplash videos or generic images */}
            {[
              "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1551076805-e18690c5e577?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1584982751601-97d8cb0f6669?q=80&w=400&auto=format&fit=crop",
            ].slice(0, showAllInsta ? 5 : 4).map((src, i) => (
              <a 
                key={i} 
                href="https://www.instagram.com/haya_wellness_and_diagno/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative w-48 md:w-64 aspect-[9/16] rounded-[2rem] overflow-hidden group shadow-md hover:shadow-xl transition-all"
              >
                <Image src={src} alt="Instagram Reel" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-emerald-deep/20 group-hover:bg-emerald-deep/40 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="bg-white/90 p-1.5 rounded-lg shadow-sm">
                    <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {!showAllInsta ? (
          <div className="mt-8 text-center">
            <button 
              onClick={() => setShowAllInsta(true)}
              className="inline-flex items-center gap-2 text-emerald-deep font-semibold hover:text-emerald-teal transition-colors border-b-2 border-emerald-teal pb-1"
            >
              View More Reels
            </button>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <a href="https://www.instagram.com/haya_wellness_and_diagno/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-teal font-semibold hover:text-emerald-deep transition-colors group">
              @haya_wellness_and_diagno
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </section>

      {/* Health Blogs Section */}
      <section className="bg-ivory-warm py-20 md:py-28 w-full border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold text-emerald-teal uppercase tracking-widest mb-4 block">Health Insights</span>
              <h2 className="text-4xl font-serif text-emerald-deep mb-4 leading-tight">Latest Health Blogs & Articles</h2>
              <p className="text-text-muted text-lg">Stay updated with the latest medical news, tips, and healthy lifestyle advice from our experts.</p>
            </div>
            <Link 
              href="/blogs"
              className="bg-white text-emerald-deep px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-teal hover:text-white transition-all shadow-sm flex items-center gap-2 group border border-gray-200"
            >
              Read all articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {BLOGS.slice(0, 4).map(blog => (
              <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 flex flex-col group">
                <div className="relative h-32 md:h-40 w-full overflow-hidden">
                  <Image src={blog.image} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-deep shadow-sm">
                    {blog.category}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-[10px] md:text-xs text-text-muted mb-2 flex items-center gap-1.5">
                    <CalendarIcon className="w-3 h-3" />
                    {blog.date}
                  </div>
                  <h3 className="text-sm md:text-lg font-serif text-emerald-deep mb-2 group-hover:text-emerald-teal transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                  <p className="text-text-muted text-[10px] md:text-xs line-clamp-2 mb-4 flex-1">{blog.excerpt}</p>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-auto">
                    <Image src={blog.author.photo} alt={blog.author.name} width={32} height={32} className="rounded-full object-cover shadow-sm border border-gray-100" />
                    <div>
                      <p className="text-xs font-bold text-emerald-deep leading-none">{blog.author.name}</p>
                      <p className="text-[10px] text-emerald-teal mt-0.5">Author</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Feedback Section */}
      <ReviewSection />
      
      {/* Massive Final CTA Block */}
      <section className="py-20 md:py-28 bg-emerald-deep text-white text-center px-4 relative overflow-hidden mt-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Ready to prioritize your health?</h2>
          <p className="text-lg md:text-xl text-emerald-soft mb-10 max-w-2xl mx-auto">
            Book an appointment today with our expert specialists. We are here for you and your family.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/appointment"
              className="w-full sm:w-auto bg-gold-subtle text-emerald-deep px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Book Your Visit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/contact"
              className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      
      {/* Spacer before footer */}
      <div className="h-0"></div>
    </main>
  );
}
