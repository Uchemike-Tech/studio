
export interface Document {
  id: string;
  name: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  submittedAt: Date | string; // Allow string for Supabase dates
  updatedAt: Date | string; // Allow string for Supabase dates
  fileUrl?: string;
  analysis?: {
    summary: string;
    suggestedStatus: string;
  };
}

export interface Student {
  id?: string; // The user's auth ID from Supabase
  name: string;
  email?: string;
  clearanceProgress: number;
  documents: Document[];
}

export interface AppSettings {
  id?: number; // Supabase needs an identifier, should be a number
  requiredDocuments: number;
}
