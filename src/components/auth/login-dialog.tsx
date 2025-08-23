
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { mockStudent } from '@/lib/mock-data';

interface LoginDialogProps {
  userType: 'student' | 'admin';
}

export function LoginDialog({ userType }: LoginDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(userType === 'student' ? 'student@futo.edu.ng' : 'admin@futo.edu.ng');
  const [password, setPassword] = React.useState('password');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If sign-in fails because the user doesn't exist, try to sign them up
        if (signInError.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) {
            // If sign-up also fails, throw the sign-up error
            throw signUpError;
          }
          
          if (!signUpData.user) {
            throw new Error("Sign up successful, but no user data returned. Please check your Supabase email confirmation settings.")
          }
          
          // If this is the demo student, create their record in the database
          if (userType === 'student' && signUpData.user) {
              const { error: insertError } = await supabase.from('students').insert({
                ...mockStudent,
                id: signUpData.user.id, // Use the auth user's ID
                email: signUpData.user.email, // Use the auth user's email
              });
              if (insertError) {
                  // Ignore unique constraint violation if student already exists
                  if (insertError.code !== '23505') { 
                    console.error("Failed to create student record:", insertError);
                    throw new Error("Could not create the initial student record.");
                  }
              }
          }

        } else {
          // If the sign-in error is not "Invalid login credentials", throw it
          throw signInError;
        }
      }

      const path =
        userType === 'student' ? '/student/dashboard' : '/admin/dashboard';
      router.push(path);
      setOpen(false);

    } catch (error: any) {
      console.error("Login/Signup failed:", error);
      toast({
        title: 'Authentication Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LogIn className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
