
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/layout';
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
import { Button } from '@/components/ui/button';
import type { Student, Document } from '@/lib/types';
import { getAllStudents } from '@/lib/store';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PendingDocument extends Document {
  studentId: number;
  studentAuthId: string;
  studentName: string;
}

const statusColors: { [key in Document['status']]: string } = {
  Approved:
    'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Pending:
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  Rejected:
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
};

const statusIcons = {
  Pending: <Clock className="h-4 w-4 text-yellow-600" />,
  Approved: <div />,
  Rejected: <div />,
};

export default function AdminRequestsPage() {
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPendingDocs() {
      try {
        const students = await getAllStudents();
        const pendingDocs = students
          .flatMap((student) =>
            (student.documents || [])
              .filter((doc) => doc.status === 'Pending')
              .map((doc) => ({
                ...doc,
                studentId: student.id,
                studentAuthId: student.auth_id,
                studentName: student.name,
              }))
          )
          .sort(
            (a, b) =>
              new Date(b.submittedAt).getTime() -
              new Date(a.submittedAt).getTime()
          );
        setPendingDocuments(pendingDocs);
      } catch (error) {
        console.error("Failed to fetch pending documents:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPendingDocs();
  }, []);

  return (
    <DashboardLayout userType="admin">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Pending Requests
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Documents Awaiting Review</CardTitle>
          <CardDescription>
            The following documents have been submitted by students and require your
            approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-24 text-center text-muted-foreground">Loading requests...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Submitted At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="font-medium">{doc.studentName}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {doc.studentAuthId}
                          </div>
                        </TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('gap-x-2', statusColors[doc.status])}
                          >
                            {statusIcons[doc.status]}
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(doc.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/student/${doc.studentId}`}>
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
