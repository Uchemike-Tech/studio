
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStudent, updateDocumentStatus, getSettings } from '@/lib/store';
import type { Student, Document, AppSettings } from '@/lib/types';
import { ArrowLeft, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

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

export default function StudentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentData = useCallback(async () => {
    if (typeof id === 'string') {
      try {
        const studentData = await getStudent(id);
        if (studentData) {
          setStudent(studentData);
        } else {
          toast({ title: 'Error', description: 'Student not found.', variant: 'destructive' });
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
        toast({ title: 'Error', description: 'Failed to load student details.', variant: 'destructive' });
      }
    }
  }, [id, toast]);


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const appSettings = await getSettings();
      setSettings(appSettings);
      await fetchStudentData();
      setIsLoading(false);
    }
    if (id) {
        fetchData();
    }
  }, [id, fetchStudentData]);

  const handleStatusUpdate = async (docId: string, status: 'Approved' | 'Rejected') => {
    if (typeof id === 'string') {
        try {
            await updateDocumentStatus(id, docId, status);
            // Refetch data to show the update
            await fetchStudentData();
            toast({
              title: `Document ${status}`,
              description: `The document has been successfully ${status.toLowerCase()}.`,
            });
        } catch (error) {
            console.error("Failed to update status:", error);
            toast({ title: 'Error', description: 'Failed to update document status.', variant: 'destructive' });
        }
    }
  };

  const handleViewDocument = (doc: Document) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      toast({
        title: 'Document Unavailable',
        description: 'The document URL is missing.',
        variant: 'destructive',
      });
    }
  };

  const clearanceProgress = student && settings ? Math.min((student.documents.filter(d => d.status === 'Approved').length / settings.requiredDocuments) * 100, 100) : 0;

  if (isLoading) {
    return (
      <DashboardLayout userType="admin">
        <div>Loading student details...</div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Student Not Found</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Clearance Details
        </h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{student.name}</CardTitle>
            <CardDescription>
              {student.id} | {student.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={clearanceProgress} className="w-full max-w-sm" />
              <span className="font-semibold">{clearanceProgress.toFixed(0)}% Complete</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
            <CardDescription>
              Review and approve/reject the documents submitted by the student.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Last Updated</TableHead>
                    <TableHead className="hidden md:table-cell">AI Suggestion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No documents submitted yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    student.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('gap-x-2', statusColors[doc.status])}>
                            {statusIcons[doc.status]}
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{new Date(doc.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {doc.analysis?.suggestedStatus || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-accent text-accent-foreground hover:bg-accent/90"
                              onClick={() => handleStatusUpdate(doc.id, 'Approved')}
                              disabled={doc.status === 'Approved'}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusUpdate(doc.id, 'Rejected')}
                              disabled={doc.status === 'Rejected'}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
