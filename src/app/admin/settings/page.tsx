
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/dashboard/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getSettings, updateSettings } from '@/lib/store';
import type { AppSettings } from '@/lib/types';

const settingsSchema = z.object({
  requiredDocuments: z.coerce
    .number()
    .min(1, 'At least 1 document is required')
    .max(20, 'Cannot require more than 20 documents'),
});

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AppSettings>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
    reset(currentSettings); // Populate form with current settings
  }, [reset]);

  const onSubmit = (data: AppSettings) => {
    updateSettings(data);
    setSettings(data);
    toast({
      title: 'Settings Updated',
      description: 'Your changes have been saved successfully.',
    });
    reset(data); // Reset form state to new values
  };

  if (!settings) {
    return (
      <DashboardLayout userType="admin">
        <div>Loading settings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Settings
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Manage global settings for the clearance portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="requiredDocuments">
                  Number of Required Documents
                </Label>
                <Input
                  id="requiredDocuments"
                  type="number"
                  {...register('requiredDocuments')}
                  className="mt-1 max-w-xs"
                />
                {errors.requiredDocuments && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.requiredDocuments.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  This is the total number of approved documents a student needs
                  to be fully cleared.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={!isDirty}>
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </DashboardLayout>
  );
}
