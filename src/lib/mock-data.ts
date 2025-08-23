import type { Student } from './types';

export const mockStudent: Student = {
  id: 'FUTO/2024/12345',
  name: 'John Doe',
  email: 'john.doe@futo.edu.ng',
  clearanceProgress: 50,
  documents: [
    {
      id: 'doc1',
      name: 'School Fees Receipt',
      status: 'Approved',
      submittedAt: new Date('2024-07-15T10:00:00Z'),
      updatedAt: new Date('2024-07-16T11:30:00Z'),
      analysis: {
        summary:
          'The receipt confirms full payment of school fees for the current session.',
        suggestedStatus: 'Approved',
      },
    },
    {
      id: 'doc2',
      name: 'Hostel Clearance Form',
      status: 'Approved',
      submittedAt: new Date('2024-07-17T09:00:00Z'),
      updatedAt: new Date('2024-07-17T14:00:00Z'),
      analysis: {
        summary:
          'The form is duly signed and stamped by the hostel administrator.',
        suggestedStatus: 'Approved',
      },
    },
    {
      id: 'doc3',
      name: 'Departmental Dues Receipt',
      status: 'Pending',
      submittedAt: new Date('2024-07-20T15:00:00Z'),
      updatedAt: new Date('2024-07-20T15:00:00Z'),
    },
    {
      id: 'doc4',
      name: 'Library Clearance',
      status: 'Rejected',
      submittedAt: new Date('2024-07-18T11:00:00Z'),
      updatedAt: new Date('2024-07-19T09:00:00Z'),
      analysis: {
        summary:
          'The document submitted is blurry and unreadable. A new upload is required.',
        suggestedStatus: 'Rejected',
      },
    },
  ],
};
