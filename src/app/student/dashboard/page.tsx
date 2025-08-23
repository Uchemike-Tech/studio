
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Student, Document, AppSettings } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  XCircle,
  FileUp,
  QrCode,
} from 'lucide-react';
import { DocumentUploadForm } from './_components/document-upload-form';
import Image from 'next/image';
import { getStudent, updateStudent, getSettings, createStudent } from '@/lib/store';
import { ViewDocumentDialog } from './_components/view-document-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

const statusIcons = {
  Approved: <CheckCircle className="h-4 w-4 text-green-600" />,
  Pending: <Clock className="h-4 w-4 text-yellow-600" />,
  Rejected: <XCircle className="h-4 w-4 text-red-600" />,
};

const statusColors: { [key in Document['status']]: string } = {
  Approved:
    'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Pending:
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  Rejected:
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user || !session.user.email) {
            toast({
                title: 'Not Authenticated',
                description: 'You must be logged in to view this page.',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }
        const user = session.user;

        // First, fetch the global app settings
        const settingsData = await getSettings();
        setSettings(settingsData);
        
        // Then, try to get the student record using their email
        let studentData = await getStudent(user.email);
        
        // If no student record exists, create one
        if (!studentData) {
            toast({
                title: "Welcome!",
                description: "Creating your student profile..."
            });
            // Create the student record and wait for it to complete
            const newStudent = await createStudent(user.id, user.email);
            studentData = newStudent;
        }
        
        setStudent(studentData || null);
        
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        toast({
          title: 'Error',
          description: 'Could not load your dashboard data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialData();
  }, [toast]);

  const handleDocumentUpload = async (newDocument: Document) => {
    if (student) {
      const updatedStudent: Student = {
        ...student,
        documents: [...student.documents, newDocument],
      };
      try {
        await updateStudent(updatedStudent);
        setStudent(updatedStudent);
        toast({
            title: 'Document Submitted',
            description: `${newDocument.name} has been submitted for review.`,
        });
      } catch (error) {
        console.error("Failed to upload document:", error);
        toast({
            title: 'Upload Failed',
            description: 'There was an error submitting your document.',
            variant: 'destructive'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="student">
        <div>Loading student data...</div>
      </DashboardLayout>
    );
  }

  if (!student || !settings) {
    return (
      <DashboardLayout userType="student">
        <div>Could not load student data. Please ensure you are logged in and have a student record.</div>
      </DashboardLayout>
    );
  }

  const approvedDocs = student.documents.filter(
    (d) => d.status === 'Approved'
  ).length;
  const pendingDocs = student.documents.filter(
    (d) => d.status === 'Pending'
  ).length;
  const rejectedDocs = student.documents.filter(
    (d) => d.status === 'Rejected'
  ).length;
  const totalRequiredDocs = settings.requiredDocuments;
  const clearanceProgress = Math.min(
    (approvedDocs / totalRequiredDocs) * 100,
    100
  );

  return (
    <DashboardLayout userType="student">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Welcome, {student.name}!
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clearance Progress
            </CardTitle>
            <span className="text-2xl font-bold text-primary">
              {clearanceProgress.toFixed(0)}%
            </span>
          </CardHeader>
          <CardContent>
            <Progress
              value={clearanceProgress}
              aria-label={`${clearanceProgress}% clearance complete`}
            />
            <CardDescription className="pt-2 text-xs text-muted-foreground">
              {clearanceProgress === 100
                ? 'Congratulations! Your clearance is complete.'
                : 'Keep uploading required documents to proceed.'}
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documents Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedDocs}</div>
            <p className="text-xs text-muted-foreground">
              out of {totalRequiredDocs} total required
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDocs}</div>
            <p className="text-xs text-muted-foreground">
              documents are awaiting admin approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedDocs}</div>
            <p className="text-xs text-muted-foreground">
              documents were rejected
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Document Submission
            </CardTitle>
            <CardDescription>
              Upload your documents for clearance. Our AI will perform an
              initial analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploadForm
              studentId={student.id!}
              onDocumentUpload={handleDocumentUpload}
            />
          </CardContent>
        </Card>
        <Card
          className={cn(
            'flex flex-col items-center justify-center transition-all',
            clearanceProgress < 100 && 'border-dashed bg-muted/50'
          )}
        >
          {clearanceProgress === 100 ? (
            <>
              <CardHeader className="w-full">
                <CardTitle className="flex items-center gap-2">
                  <QrCode /> Clearance Verified
                </CardTitle>
                <CardDescription>
                  Your clearance is complete. Generate your QR code for
                  verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col items-center justify-center gap-4">
                <Image
                  src="https://placehold.co/200x200.png"
                  alt="QR Code"
                  width={200}
                  height={200}
                  data-ai-hint="qr code"
                />
              </CardContent>
              <CardFooter className="w-full">
                <Button className="w-full">Download Clearance Slip</Button>
              </CardFooter>
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <QrCode className="mx-auto mb-4 h-12 w-12" />
              <h3 className="text-lg font-semibold text-foreground">
                Clearance Slip & QR Code
              </h3>
              <p>Complete all clearance steps to generate your slip.</p>
            </div>
          )}
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>
            Overview of your submitted documents and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead>Document Name</TableHead>
                  <TableHead>AI Analysis</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Updated
                  </TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.documents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No documents submitted
                    </TableCell>
                  </TableRow>
                ) : (
                  student.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('gap-2', statusColors[doc.status])}
                        >
                          {statusIcons[doc.status]}
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {doc.analysis?.summary ||
                          'Awaiting submission for analysis.'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setViewingDocument(doc)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {viewingDocument && (
        <ViewDocumentDialog
          document={viewingDocument}
          onOpenChange={(isOpen) => !isOpen && setViewingDocument(null)}
        />
      )}
    </DashboardLayout>
  );
}
