
// In-memory data store for prototyping purposes.
// In a real application, this would be replaced with a proper database.

import type { Student, Document, AppSettings } from './types';

let settings: AppSettings = {
  requiredDocuments: 6,
};

const students: { [id: string]: Student } = {
  'FUTO/2024/00000': {
    id: 'FUTO/2024/00000',
    name: 'Student',
    email: 'student@futo.edu.ng',
    clearanceProgress: 0,
    documents: [],
  },
};

// --- Settings ---
export function getSettings(): AppSettings {
  // Return a copy to prevent direct mutation
  return { ...settings };
}

export function updateSettings(newSettings: AppSettings): void {
  settings = { ...settings, ...newSettings };
}

// --- Students ---
export function getStudent(id: string): Student | undefined {
  // Return a copy to prevent direct mutation
  return students[id] ? { ...students[id] } : undefined;
}

export function updateStudent(student: Student): void {
  if (students[student.id]) {
    students[student.id] = student;
  }
}

export function getAllStudents(): Student[] {
  return Object.values(students).map(s => ({...s, documents: [...s.documents]}));
}

export function getStudentDocument(studentId: string, docId: string): Document | undefined {
    const student = getStudent(studentId);
    if (!student) return undefined;
    return student.documents.find(d => d.id === docId);
}

export function updateDocumentStatus(studentId: string, docId: string, status: 'Approved' | 'Rejected'): Student | undefined {
    const student = getStudent(studentId);
    if (!student) return undefined;

    const docIndex = student.documents.findIndex(d => d.id === docId);
    if (docIndex === -1) return undefined;
    
    student.documents[docIndex].status = status;
    student.documents[docIndex].updatedAt = new Date();

    updateStudent(student);
    return student;
}
