
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
  id: string;
  name: string;
  email: string;
  clearanceProgress: number;
  documents: Document[];
}

export interface AppSettings {
  id?: string; // Supabase needs an identifier
  requiredDocuments: number;
}
