'use client';

import { useState, useEffect } from 'react';
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
import { Activity, Users, CheckCircle, Clock, MoreHorizontal } from 'lucide-react';
import { ClearanceChart } from './_components/clearance-chart';
import type { Student } from '@/lib/types';
import { getAllStudents } from '@/lib/store';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // In a real app, you might fetch this data from an API
    setStudents(getAllStudents());
  }, []);

  const totalStudents = students.length;
  const pendingRequests = students.filter(student =>
    student.documents.some(doc => doc.status === 'Pending')
  ).length;

  const totalRequiredDocs = 6;
  const getClearanceProgress = (student: Student) => {
    const approvedDocs = student.documents.filter(d => d.status === 'Approved').length;
    return Math.min((approvedDocs / totalRequiredDocs) * 100, 100);
  };
  
  const fullyClearedStudents = students.filter(s => getClearanceProgress(s) === 100).length;
  const inProgressStudents = students.filter(s => {
    const progress = getClearanceProgress(s);
    return progress > 0 && progress < 100;
  }).length;
  const actionRequiredStudents = students.filter(s => s.documents.some(d => d.status === 'Rejected')).length;
  const notStartedStudents = students.filter(s => s.documents.length === 0).length;

  const chartData = {
    fullyCleared: fullyClearedStudents,
    inProgress: inProgressStudents,
    actionRequired: actionRequiredStudents,
    notStarted: notStartedStudents,
  };


  const getLatestUpdate = (student: Student) => {
    if (student.documents.length === 0) return 'N/A';
    return new Date(
      Math.max(...student.documents.map((d) => new Date(d.updatedAt).getTime()))
    ).toLocaleDateString();
  };


  return (
    <DashboardLayout userType="admin">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Admin Dashboard
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {totalStudents > 0 ? `${totalStudents} registered` : 'No students yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              {pendingRequests > 0 ? 'awaiting review' : 'No pending requests'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fully Cleared</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fullyClearedStudents}</div>
            <p className="text-xs text-muted-foreground">
              students have completed clearance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Clearance Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Clearance Requests</CardTitle>
            <CardDescription>
              An overview of the most recent student submissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="hidden md:table-cell">Last Update</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No student data available
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="font-medium">{student.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {student.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Progress value={getClearanceProgress(student)} className="w-24" />
                           <span>{getClearanceProgress(student).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                       <TableCell className="hidden md:table-cell">
                        {getLatestUpdate(student)}
                      </TableCell>
                      <TableCell>
                         <Link href={`/admin/student/${student.id}`}>
                           <Button variant="outline" size="sm">
                             View
                           </Button>
                         </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Clearance Status Distribution</CardTitle>
            <CardDescription>
              A visual breakdown of current clearance statuses across all students.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ClearanceChart data={chartData} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
