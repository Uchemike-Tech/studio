
import { supabase } from './supabase-client';
import type { Student, Document, AppSettings } from './types';
import { mockStudent } from './mock-data';

// --- Settings ---
export async function getSettings(): Promise<AppSettings> {
  // This is the default settings object that will be returned if no settings are found in the database.
  // The settings page in the admin dashboard is responsible for creating the first record.
  const defaultSettings: AppSettings = { id: 1, requiredDocuments: 6 };

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = "object not found"
    console.error('Error fetching settings:', error.message || 'An unknown error occurred');
    // If there's an actual error (not just 'not found'), return defaults to prevent a crash.
    return defaultSettings;
  }
  
  // If no data is found (e.g., first run), return the default settings object.
  return data || defaultSettings;
}

export async function updateSettings(newSettings: AppSettings): Promise<void> {
    // Use upsert to create the record if it doesn't exist, or update it if it does.
  const { error } = await supabase
    .from('settings')
    .upsert(newSettings, { onConflict: 'id' });

  if (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// --- Students ---
export async function getStudent(id: string): Promise<Student | undefined> {
  if (!id) {
    console.error('getStudent called with no user ID.');
    return undefined;
  }
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
      console.error(`Error getting student with ID ${id}:`, error.message);
  }
  
  if (data) {
    return {
        ...data,
        documents: data.documents || [] // Ensure documents is always an array
    } as Student;
  }

  return undefined; // Explicitly return undefined if no data
}


export async function createStudent(id: string, email: string): Promise<Student> {
  const newStudentData: Omit<Student, 'documents' | 'clearanceProgress'> = {
    id,
    email,
    name: 'New Student' // A default name
  };
  const { data, error } = await supabase.from('students').insert(newStudentData).select().single();

  if(error) {
    console.error('Error creating student record:', error);
    throw error;
  }

  return data as Student;
}


export async function updateStudent(student: Student): Promise<void> {
    if (!student.id) {
      console.error("updateStudent called without a student ID.");
      return;
    }
    // Omit 'id' from the update payload as it's the primary key and shouldn't be changed.
    const { id, ...studentData } = student;
    const { error } = await supabase
      .from('students')
      .update(studentData)
      .eq('id', id);

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
    const student = await getStudent(studentId);
    if (!student) {
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
    
    return await getStudent(studentId);
}
