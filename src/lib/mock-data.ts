
import type { Student } from './types';

// The ID and email will be dynamically set from Supabase Auth
export const mockStudent: Omit<Student, 'id' | 'email' | 'documents'> = {
  name: 'Demo Student',
};
