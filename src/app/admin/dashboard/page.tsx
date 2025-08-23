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
import { Activity, Users, CheckCircle, Clock } from 'lucide-react';
import { ClearanceChart } from './_components/clearance-chart';
import { mockStudent } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { Document } from '@/lib/types';

const statusColors: { [key in Document['status'] | 'Complete' | 'In Progress']: string } = {
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Complete: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
};

const mockRequests = [
  { ...mockStudent, id: 'FUTO/2024/12345', name: 'John Doe', clearanceProgress: 50 },
  { ...mockStudent, id: 'FUTO/2024/67890', name: 'Jane Smith', clearanceProgress: 100, documents: mockStudent.documents.map(d => ({ ...d, status: 'Approved' })) },
  { ...mockStudent, id: 'FUTO/2024/54321', name: 'Sam Wilson', clearanceProgress: 25, documents: mockStudent.documents.map(d => ({ ...d, status: 'Rejected' })) },
  { ...mockStudent, id: 'FUTO/2024/09876', name: 'Binta Bello', clearanceProgress: 75, documents: mockStudent.documents.map((d, i) => ({ ...d, status: i < 3 ? 'Approved' : 'Pending' })) },
];

export default function AdminDashboardPage() {
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
            <div className="text-2xl font-bold">452</div>
            <p className="text-xs text-muted-foreground">+5 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 since last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cleared this Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Clearance Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5 Days</div>
            <p className="text-xs text-muted-foreground">-0.5 days from last week</p>
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
                {mockRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium">{req.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {req.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(req.clearanceProgress === 100 ? statusColors['Complete'] : statusColors['In Progress'])}>
                        {req.clearanceProgress}% Complete
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {req.documents[0].updatedAt.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
            <ClearanceChart />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
