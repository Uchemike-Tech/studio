
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { ClearanceChart } from '../dashboard/_components/clearance-chart';
import type { Student, AppSettings } from '@/lib/types';
import { getAllStudents, getSettings } from '@/lib/store';
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalyticsData() {
        try {
            const [studentsData, settingsData] = await Promise.all([
              getAllStudents(),
              getSettings(),
            ]);
            setStudents(studentsData);
            setSettings(settingsData);
        } catch (error) {
            console.error("Failed to fetch data for analytics:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchAnalyticsData();
  }, []);

  if (isLoading || !settings) {
      return (
          <DashboardLayout userType="admin">
            <div>Loading analytics...</div>
          </DashboardLayout>
      );
  }

  const totalRequiredDocs = settings.requiredDocuments;
  const getClearanceProgress = (student: Student) => {
    const approvedDocs = student.documents.filter(
      (d) => d.status === 'Approved'
    ).length;
    return Math.min((approvedDocs / totalRequiredDocs) * 100, 100);
  };

  const fullyClearedStudents = students.filter(
    (s) => getClearanceProgress(s) === 100
  ).length;
  const inProgressStudents = students.filter((s) => {
    const progress = getClearanceProgress(s);
    return progress > 0 && progress < 100;
  }).length;
  const actionRequiredStudents = students.filter((s) =>
    s.documents.some((d) => d.status === 'Rejected')
  ).length;
  const notStartedStudents = students.filter(
    (s) => s.documents.length === 0
  ).length;

  const chartData = {
    fullyCleared: fullyClearedStudents,
    inProgress: inProgressStudents,
    actionRequired: actionRequiredStudents,
    notStarted: notStartedStudents,
  };

  return (
    <DashboardLayout userType="admin">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Analytics
        </h1>
      </div>
        <>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fully Cleared</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fullyClearedStudents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressStudents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Action Required
                </CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{actionRequiredStudents}</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Clearance Status Distribution</CardTitle>
              <CardDescription>
                A visual breakdown of current clearance statuses across all
                students.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ClearanceChart data={chartData} />
            </CardContent>
          </Card>
        </>
    </DashboardLayout>
  );
}
