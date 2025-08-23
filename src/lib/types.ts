
export interface Document {
  id: string;
  name: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  submittedAt: Date;
  updatedAt: Date;
  fileUrl?: string; // Changed from fileDataUri
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
  requiredDocuments: number;
}
