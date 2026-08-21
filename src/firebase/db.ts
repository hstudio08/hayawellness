import { db } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// Types
export interface Department {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: string;
  services: string[];
  conditions: string[];
  isActive: boolean;
}

export interface Doctor {
  id?: string;
  name: string;
  slug: string;
  departmentId: string;
  specialization: string;
  qualifications: string[];
  experience: string;
  bio: string;
  photo: string;
  availability: string;
  slots: number;
  timings: string;
  isActive: boolean;
}

export interface Appointment {
  id?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge?: string;
  patientGender?: string;
  patientMessage?: string;
  departmentId: string;
  doctorId?: string;
  doctorName?: string;
  date: string; // ISO string or MMM dd, yyyy
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: any;
  rescheduleCount?: number;
}

// ----------------------------------------------------
// Doctors
// ----------------------------------------------------
export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const q = query(collection(db, 'doctors'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
  } catch (e) {
    const snapshot = await getDocs(collection(db, 'doctors'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
  }
};

export const addDoctor = async (doctor: Omit<Doctor, 'id'>) => {
  return await addDoc(collection(db, 'doctors'), doctor);
};

export const updateDoctor = async (id: string, doctor: Partial<Doctor>) => {
  const ref = doc(db, 'doctors', id);
  return await updateDoc(ref, doctor);
};

export const deleteDoctor = async (id: string) => {
  const ref = doc(db, 'doctors', id);
  return await deleteDoc(ref);
};

// ----------------------------------------------------
// Departments
// ----------------------------------------------------
export const getDepartments = async (): Promise<Department[]> => {
  try {
    const q = query(collection(db, 'departments'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
  } catch (e) {
    const snapshot = await getDocs(collection(db, 'departments'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
  }
};

export const addDepartment = async (department: Omit<Department, 'id'>) => {
  return await addDoc(collection(db, 'departments'), department);
};

export const updateDepartment = async (id: string, department: Partial<Department>) => {
  const ref = doc(db, 'departments', id);
  return await updateDoc(ref, department);
};

export const deleteDepartment = async (id: string) => {
  const ref = doc(db, 'departments', id);
  return await deleteDoc(ref);
};

// ----------------------------------------------------
// Appointments
// ----------------------------------------------------
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'appointments'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    return list.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date).getTime() || 0;
      const timeB = new Date(b.createdAt || b.date).getTime() || 0;
      return timeB - timeA;
    });
  } catch (e) {
    console.error("Error fetching appointments:", e);
    return [];
  }
};

export const getAppointmentsByEmail = async (email: string): Promise<Appointment[]> => {
  try {
    const q = query(collection(db, 'appointments'), where('patientEmail', '==', email));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    return list.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date).getTime() || 0;
      const timeB = new Date(b.createdAt || b.date).getTime() || 0;
      return timeB - timeA;
    });
  } catch (e) {
    console.error("Error fetching patient appointments:", e);
    return [];
  }
};

export const getAppointment = async (id: string): Promise<Appointment | null> => {
  try {
    const docRef = doc(db, 'appointments', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Appointment;
    }
    return null;
  } catch (e) {
    console.error("Error fetching appointment:", e);
    return null;
  }
};

export const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
  return await addDoc(collection(db, 'appointments'), appointment);
};

export const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
  const ref = doc(db, 'appointments', id);
  return await updateDoc(ref, { status });
};

export const rescheduleAppointment = async (id: string, date: string, time: string, newCount: number) => {
  const ref = doc(db, 'appointments', id);
  return await updateDoc(ref, { date, time, status: 'Pending', rescheduleCount: newCount });
};

// ----------------------------------------------------
// PATIENT PROFILES
// ----------------------------------------------------
export interface PatientProfile {
  email: string;
  name: string;
}

export const getPatientProfile = async (email: string): Promise<PatientProfile | null> => {
  try {
    const docRef = doc(db, 'patients', email.toLowerCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as PatientProfile;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const updatePatientProfile = async (email: string, name: string) => {
  const docRef = doc(db, 'patients', email.toLowerCase());
  return await setDoc(docRef, { email, name }, { merge: true });
};
