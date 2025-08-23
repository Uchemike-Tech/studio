
import { supabase } from './supabase-client';
import type { Student, Document, AppSettings } from './types';

// --- Settings ---
export async function getSettings(): Promise<AppSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: "object not found"
    console.error('Error fetching settings:', error.message || 'An unknown error occurred');
    // Don't throw, proceed to create default settings as a fallback.
  }

  if (data) {
    return data;
  } else {
    // If settings don't exist, create and return them.
    const defaultSettings: AppSettings = { id: 1, requiredDocuments: 6 };
    const { data: insertedData, error: insertError } = await supabase
      .from('settings')
      .insert(defaultSettings)
      .select()
      .single();
      
    if (insertError) {
      console.error('Error inserting default settings:', insertError.message);
      // If insertion fails, return the default object anyway to prevent app crash
      return { id: 1, requiredDocuments: 6 };
    }
    return insertedData || { id: 1, requiredDocuments: 6 };
  }
}

export async function updateSettings(newSettings: AppSettings): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .update(newSettings)
    .eq('id', 1);

  if (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// --- Students ---
export async function getStudent(email: string): Promise<Student | undefined> {
  if (!email) {
    console.error('getStudent called with no email.');
    return undefined;
  }
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
      console.error(`Error getting student with email ${email}:`, error.message);
  }
  
  if (data) {
    return {
        ...data,
        documents: data.documents || [] // Ensure documents is always an array
    } as Student;
  }

  return undefined;
}

export async function updateStudent(student: Student): Promise<void> {
    if (!student.id) {
      console.error("updateStudent called without a student ID.");
      return;
    }
    const { error } = await supabase
      .from('students')
      .upsert(student);

    if (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}

export async function getAllStudents(): Promise<Student[]> {
  const { data, error } = await supabase.from('students').select('*');
  if (error) {
    console.error('Error getting all students:', error);
    throw error;
  }
  return (data as Student[]) || [];
}


export async function updateDocumentStatus(studentId: string, docId: string, status: 'Approved' | 'Rejected'): Promise<Student | undefined> {
    const { data: student, error: getStudentError } = await supabase.from('students').select('*').eq('id', studentId).single();
    if (getStudentError || !student) {
        console.error(`Could not retrieve student ${studentId} to update document status.`);
        return undefined;
    };

    const docIndex = student.documents.findIndex((d: Document) => d.id === docId);
    if (docIndex === -1) return undefined;
    
    const updatedDocuments = [...student.documents];
    updatedDocuments[docIndex].status = status;
    updatedDocuments[docIndex].updatedAt = new Date().toISOString();

    const { error } = await supabase
      .from('students')
      .update({ documents: updatedDocuments })
      .eq('id', studentId);
    
    if (error) {
        console.error('Error updating document status:', error);
        throw error;
    }
    
    const { data: updatedStudent } = await supabase.from('students').select('*').eq('id', studentId).single();

    return updatedStudent;
}
