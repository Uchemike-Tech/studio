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
import { getStudent } from '@/lib/store';
import { mockStudent } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

interface LoginDialogProps {
  userType: 'student' | 'admin';
}

export function LoginDialog({ userType }: LoginDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(userType === 'student' ? 'student@futo.edu.ng' : 'admin@futo.edu.ng');
  const [password, setPassword] = React.useState('password');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
         if (userType === 'student') {
            const studentId = 'FUTO/2024/00000';
            // Check if student exists, if not, getStudent will create it.
            await getStudent(studentId);
         }
        const path =
          userType === 'student' ? '/student/dashboard' : '/admin/dashboard';
        router.push(path);
        setOpen(false); // Close dialog on navigation
      }

    } catch (error: any) {
        console.error("Login failed:", error);
        toast({
            title: 'Login Failed',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive'
        })
    }
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
