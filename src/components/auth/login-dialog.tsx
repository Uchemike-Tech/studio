'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import React from 'react';

interface LoginDialogProps {
  userType: 'student' | 'admin';
}

export function LoginDialog({ userType }: LoginDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd have auth logic here.
    // For this demo, we'll just navigate to the respective dashboard.
    const path =
      userType === 'student' ? '/student/dashboard' : '/admin/dashboard';
    router.push(path);
    setOpen(false); // Close dialog on navigation
  };

  const title = userType === 'student' ? 'Student Login' : 'Admin Login';
  const description = `Enter your credentials to access the ${userType} dashboard.`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={userType === 'student' ? 'default' : 'outline'}
          className="w-full sm:w-auto"
        >
          <LogIn className="mr-2 h-4 w-4" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`${userType}-email`} className="text-right">
                Email
              </Label>
              <Input
                id={`${userType}-email`}
                type="email"
                defaultValue={
                  userType === 'student'
                    ? 'student@futo.edu.ng'
                    : 'admin@futo.edu.ng'
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`${userType}-password`} className="text-right">
                Password
              </Label>
              <Input
                id={`${userType}-password`}
                type="password"
                defaultValue="password"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
