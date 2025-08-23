
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Student, Document, AppSettings } from './types';
import { mockStudent } from './mock-data';

// Helper to convert Firestore Timestamps to Dates
const convertTimestamps = (data: any) => {
  if (!data) return data;
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      // Recursively convert for nested objects
      if (Array.isArray(data[key])) {
        data[key] = data[key].map(convertTimestamps);
      } else {
        convertTimestamps(data[key]);
      }
    }
  }
  return data;
};


// --- Settings ---
export async function getSettings(): Promise<AppSettings> {
  const docRef = doc(db, 'settings', 'app');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AppSettings;
  } else {
    // Return default settings if none are found
    const defaultSettings: AppSettings = { requiredDocuments: 6 };
    await setDoc(docRef, defaultSettings);
    return defaultSettings;
  }
}

export async function updateSettings(newSettings: AppSettings): Promise<void> {
  const docRef = doc(db, 'settings', 'app');
  await setDoc(docRef, newSettings, { merge: true });
}

// --- Students ---
export async function getStudent(id: string): Promise<Student | undefined> {
  const docRef = doc(db, 'students', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return convertTimestamps(docSnap.data()) as Student;
  }
  
  if (id === mockStudent.id) {
     await setDoc(docRef, mockStudent);
     return mockStudent;
  }

  return undefined;
}

export async function updateStudent(student: Student): Promise<void> {
    const studentRef = doc(db, 'students', student.id);
    // Firestore handles Date to Timestamp conversion automatically
    await setDoc(studentRef, student, { merge: true });
}

export async function getAllStudents(): Promise<Student[]> {
  const studentsCol = collection(db, 'students');
  const studentSnapshot = await getDocs(studentsCol);
  const studentList = studentSnapshot.docs.map(doc => convertTimestamps(doc.data()) as Student);
  return studentList;
}

export async function getStudentDocument(studentId: string, docId: string): Promise<Document | undefined> {
    const student = await getStudent(studentId);
    if (!student) return undefined;
    return student.documents.find(d => d.id === docId);
}

export async function updateDocumentStatus(studentId: string, docId: string, status: 'Approved' | 'Rejected'): Promise<Student | undefined> {
    const student = await getStudent(studentId);
    if (!student) return undefined;

    const docIndex = student.documents.findIndex(d => d.id === docId);
    if (docIndex === -1) return undefined;
    
    const updatedDocuments = [...student.documents];
    updatedDocuments[docIndex].status = status;
    updatedDocuments[docIndex].updatedAt = new Date();

    const studentRef = doc(db, 'students', studentId);
await updateDoc(studentRef, { documents: updatedDocuments });
    
    return getStudent(studentId);
}
