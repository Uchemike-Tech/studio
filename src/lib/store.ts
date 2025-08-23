
import { supabase } from './supabase-client';
import type { Student, Document, AppSettings } from './types';
import { mockStudent } from './mock-data';

// --- Settings ---
export async function getSettings(): Promise<AppSettings> {
  const defaultSettings: AppSettings = { id: 1, requiredDocuments: 5 };

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = "object not found"
    console.error('Error fetching settings:', error.message || 'An unknown error occurred');
  }
  
  // If no settings are found, insert the default settings.
  if (!data) {
    const { error: insertError } = await supabase.from('settings').insert(defaultSettings);
    if (insertError) {
      console.error('Error inserting default settings:', insertError);
    }
    return defaultSettings;
  }
  
  return data;
}

export async function updateSettings(newSettings: AppSettings): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert(newSettings, { onConflict: 'id' });

  if (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// --- Students ---

/**
 * Gets a student record by their numeric primary key. Used for admin pages.
 */
export async function getStudentById(id: number): Promise<Student | undefined> {
  if (!id) {
    console.error('getStudentById called with no ID.');
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
  
  return data ? { ...data, documents: data.documents || [] } : undefined;
}

/**
 * Gets a student record by their Supabase Auth ID (UUID). Used for the student dashboard.
 */
export async function getStudentByAuthId(auth_id: string): Promise<Student | undefined> {
  if (!auth_id) {
    console.error('getStudentByAuthId called with no user ID.');
    return undefined;
  }
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('auth_id', auth_id)
    .single();

  if (error && error.code !== 'PGRST116') {
      console.error(`Error getting student with auth_id ${auth_id}:`, error.message);
  }
  
  return data ? { ...data, documents: data.documents || [] } : undefined;
}


export async function createStudent(auth_id: string, email: string): Promise<Student> {
    const newStudentData = {
        auth_id,
        email,
        name: mockStudent.name,
        documents: []
    };

    const { data, error } = await supabase.from('students').insert(newStudentData).select().single();

    if(error) {
      console.error('Error creating student record:', error);
      throw error;
    }

    return data as Student;
}


export async function updateStudent(student: Student): Promise<void> {
    if (!student.auth_id) {
      console.error("updateStudent called without a student auth_id.");
      return;
    }
    
    const { error } = await supabase
      .from('students')
      .update({ documents: student.documents })
      .eq('auth_id', student.auth_id);

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


export async function updateDocumentStatus(studentAuthId: string, docId: string, status: 'Verified' | 'Rejected'): Promise<Student | undefined> {
    const student = await getStudentByAuthId(studentAuthId);
    if (!student) {
        console.error(`Could not retrieve student ${studentAuthId} to update document status.`);
        return undefined;
    };

    const docIndex = student.documents.findIndex((d: Document) => d.id === docId);
    if (docIndex === -1) return undefined;
    
    const updatedDocuments = [...student.documents];
    updatedDocuments[docIndex].status = status;
    updatedDocuments[docIndex].updatedAt = new Date().toISOString();

    await updateStudent({ ...student, documents: updatedDocuments });
    
    return await getStudentByAuthId(studentAuthId);
}
