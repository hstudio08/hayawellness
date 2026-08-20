import { db } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  setDoc
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
  departmentId: string;
  doctorId?: string;
  date: string; // ISO string
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: any;
}

// ----------------------------------------------------
// Doctors
// ----------------------------------------------------
export const getDoctors = async (): Promise<Doctor[]> => {
  const q = query(collection(db, 'doctors'), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
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
  const q = query(collection(db, 'departments'), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
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
  const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
};

export const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
  const ref = doc(db, 'appointments', id);
  return await updateDoc(ref, { status });
};
