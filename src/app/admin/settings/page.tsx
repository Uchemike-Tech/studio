
'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <DashboardLayout userType="admin">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Settings
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Settings page is under construction.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
