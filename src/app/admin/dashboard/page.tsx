"use client";

import { useEffect, useState, useMemo } from "react";
import { Activity, Calendar as CalendarIcon, Users, FileText, Database, XCircle } from "lucide-react";
import { getAppointments, getDoctors, getDepartments, Appointment } from "@/firebase/db";
import { DOCTORS, DEPARTMENTS } from "@/data/mockData";
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

const checkTimeframe = (targetDate: Date, now: Date, timeframe: string) => {
  if (timeframe === "all") return true;
  if (timeframe === "today") {
    return targetDate.toDateString() === now.toDateString();
  }
  if (timeframe === "week") {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return targetDate >= oneWeekAgo && targetDate <= now;
  }
  if (timeframe === "month") {
    return targetDate.getMonth() === now.getMonth() && targetDate.getFullYear() === now.getFullYear();
  }
  if (timeframe === "year") {
    return targetDate.getFullYear() === now.getFullYear();
  }
  return false;
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  
  const [chartView, setChartView] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [chartType, setChartType] = useState<"appointments" | "bookings">("appointments");
  const [statsTimeframe, setStatsTimeframe] = useState<"today" | "week" | "month" | "year" | "all">("today");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apts = await getAppointments();
      const docs = await getDoctors();
      const depts = await getDepartments();
      
      setAppointments(apts);
      setDoctorCount(docs.length);
      setDepartmentCount(depts.length);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!window.confirm("Are you sure you want to seed the database with mock data?")) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      DEPARTMENTS.forEach(dept => {
        const ref = doc(collection(db, "departments"));
        batch.set(ref, dept);
      });
      DOCTORS.forEach(docData => {
        const ref = doc(collection(db, "doctors"));
        batch.set(ref, docData);
      });
      await batch.commit();
      alert("Database seeded successfully!");
      fetchData();
    } catch (err) {
      console.error("Seeding error:", err);
      alert("Oops! Something went wrong.");
    } finally {
      setSeeding(false);
    }
  };

  const { totalApts, totalBookings, totalCancelled } = useMemo(() => {
    let tApts = 0;
    let tBooks = 0;
    let tCancel = 0;
    const now = new Date();

    appointments.forEach(a => {
      let isApptInTimeframe = false;
      let isBookingInTimeframe = false;

      // check appointment date
      try {
        const aD = new Date(a.date);
        isApptInTimeframe = checkTimeframe(aD, now, statsTimeframe);
      } catch(e) {}
      
      // check booking date
      if (a.createdAt) {
        try {
          const cD = new Date(a.createdAt);
          isBookingInTimeframe = checkTimeframe(cD, now, statsTimeframe);
        } catch(e) {}
      }

      if (isApptInTimeframe) {
         tApts++;
         if (a.status === 'Cancelled') tCancel++;
      }
      if (isBookingInTimeframe) {
         tBooks++;
      }
    });

    return { totalApts: tApts, totalBookings: tBooks, totalCancelled: tCancel };
  }, [appointments, statsTimeframe]);

  const chartData = useMemo(() => {
    const dataMap: Record<string, number> = {};
    const d = new Date();
    const currentYear = d.getFullYear();
    const currentMonth = d.getMonth();

    appointments.forEach(a => {
      try {
        let ad: Date | null = null;
        
        if (chartType === "appointments") {
          ad = new Date(a.date);
        } else if (chartType === "bookings" && a.createdAt) {
          ad = new Date(a.createdAt);
        }
        
        if (!ad) return;

        let key = "";
        
        if (chartView === "yearly") {
           key = String(ad.getFullYear());
        } else if (chartView === "monthly") {
           if (ad.getFullYear() !== currentYear) return; 
           key = ad.toLocaleString('default', { month: 'short' });
        } else if (chartView === "daily") {
           if (ad.getFullYear() !== currentYear || ad.getMonth() !== currentMonth) return; 
           key = String(ad.getDate());
        }

        if (key) {
           dataMap[key] = (dataMap[key] || 0) + 1;
        }
      } catch (e) {}
    });

    let result = [];
    if (chartView === "yearly") {
       for (let y = currentYear - 2; y <= currentYear + 1; y++) {
         result.push({ name: String(y), value: dataMap[String(y)] || 0 });
       }
    } else if (chartView === "monthly") {
       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
       result = months.map(m => ({ name: m, value: dataMap[m] || 0 }));
    } else if (chartView === "daily") {
       const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
       for (let i = 1; i <= daysInMonth; i++) {
          result.push({ name: String(i), value: dataMap[String(i)] || 0 });
       }
    }
    
    return result;
  }, [appointments, chartView, chartType]);


  const stats = [
    { label: "Bookings", value: totalBookings, color: "text-emerald-teal", bg: "bg-emerald-soft", icon: FileText },
    { label: "Appointments", value: totalApts, color: "text-emerald-teal", bg: "bg-emerald-soft", icon: CalendarIcon },
    { label: "Cancelled", value: totalCancelled, color: "text-red-600", bg: "bg-red-50", icon: XCircle },
    { label: "Total Doctors", value: doctorCount, color: "text-blue-600", bg: "bg-blue-50", icon: Users },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-[400px] bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  const timeframeLabels: Record<string, string> = {
    today: "Today",
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-fredoka text-emerald-deep">Dashboard Overview</h1>
          <p className="text-text-muted text-sm font-sans">Monitor your hospital's daily operations.</p>
        </div>
        <button 
          onClick={seedDatabase} 
          disabled={seeding}
          className="flex items-center gap-2 bg-emerald-soft text-emerald-teal px-4 py-2.5 rounded-xl text-sm font-oswald tracking-wide font-medium hover:bg-emerald-teal hover:text-white transition-colors"
        >
          <Database className="w-4 h-4" />
          {seeding ? "Seeding..." : "Seed Mock Data"}
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <h3 className="font-oswald tracking-wide text-text-muted uppercase text-sm">Key Metrics</h3>
         <select
            value={statsTimeframe}
            onChange={(e) => setStatsTimeframe(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-sans text-emerald-deep focus:outline-none"
         >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
         </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-emerald-teal/20 transition-all">
             <div className="flex justify-between items-start">
               <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <span className="text-[10px] uppercase font-oswald tracking-widest text-gray-400">
                 {stat.label === "Total Doctors" ? "Overall" : timeframeLabels[statsTimeframe]}
               </span>
             </div>
             <div className="mt-4">
               <p className="text-3xl font-fredoka text-emerald-deep mb-1">{stat.value}</p>
               <h3 className="text-xs font-oswald tracking-wider uppercase text-text-muted">{stat.label}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-fredoka text-emerald-deep">Analytics Graph</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select 
                value={chartType} 
                onChange={e => setChartType(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-oswald tracking-wide rounded-lg bg-gray-50 border border-gray-200 text-emerald-deep focus:outline-none"
              >
                 <option value="appointments">Appointments (Visits)</option>
                 <option value="bookings">Bookings (Created)</option>
              </select>
              
              <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100 shrink-0">
                 <button onClick={() => setChartView("daily")} className={`px-3 py-1.5 text-[11px] font-oswald tracking-wide rounded-md transition-colors ${chartView === 'daily' ? 'bg-white shadow-sm text-emerald-deep' : 'text-gray-400 hover:text-gray-600'}`}>Daily</button>
                 <button onClick={() => setChartView("monthly")} className={`px-3 py-1.5 text-[11px] font-oswald tracking-wide rounded-md transition-colors ${chartView === 'monthly' ? 'bg-white shadow-sm text-emerald-deep' : 'text-gray-400 hover:text-gray-600'}`}>Monthly</button>
                 <button onClick={() => setChartView("yearly")} className={`px-3 py-1.5 text-[11px] font-oswald tracking-wide rounded-md transition-colors ${chartView === 'yearly' ? 'bg-white shadow-sm text-emerald-deep' : 'text-gray-400 hover:text-gray-600'}`}>Yearly</button>
              </div>
            </div>
          </div>
          
          <div className="w-full flex-1 overflow-x-auto pb-4 relative custom-scrollbar">
            <div className="min-w-[500px] h-full min-h-[250px] flex items-end justify-between gap-1 px-2 pt-10 border-b border-gray-100 relative">
               <div className="absolute top-0 left-2 text-[10px] text-gray-400 font-sans uppercase tracking-widest">
                 {chartType === 'appointments' ? 'Scheduled Visits' : 'Bookings Made'}
               </div>
               {chartData.map((d, i) => {
                  const maxVal = Math.max(...chartData.map(c => c.value), 1);
                  const heightPercent = Math.round((d.value / maxVal) * 100);
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 gap-2 group relative h-full justify-end">
                       <div className="absolute bottom-[calc(100%+8px)] bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                          {d.value}
                       </div>
                       <div className="w-full bg-emerald-deep rounded-t-sm transition-all duration-300 group-hover:bg-emerald-teal" style={{ height: `${heightPercent}%`, minHeight: heightPercent > 0 ? '4px' : '0px' }}></div>
                       <span className="text-[9px] text-gray-400 font-sans mt-1">{d.name}</span>
                    </div>
                  );
               })}
            </div>
          </div>
        </div>
        
        <div className="bg-emerald-deep text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div>
            <h3 className="text-xl font-fredoka mb-2">Recent Bookings</h3>
            <div className="mt-4 flex flex-col gap-3">
               {appointments.slice(0, 5).map(apt => (
                 <div key={apt.id} className="bg-white/10 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                   <div className="flex justify-between items-start mb-1">
                     <span className="text-sm font-sans font-medium">{apt.patientName}</span>
                     <span className="text-[10px] font-oswald uppercase tracking-wider text-emerald-soft">{apt.status}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs text-white/60 font-sans">
                     <span>{apt.departmentId}</span>
                     <span>{apt.date}</span>
                   </div>
                 </div>
               ))}
               {appointments.length === 0 && (
                 <p className="text-sm text-white/60">No recent bookings.</p>
               )}
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}
