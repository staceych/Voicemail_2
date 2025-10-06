
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createUser, findUserByUsername } from '@/lib/firebase';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match!",
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      if (findUserByUsername(username)) {
        toast({
          title: 'Sign-up Failed',
          description: 'This username is already taken. Please choose another one.',
          variant: 'destructive',
        });
        setIsLoading(false);
      } else {
        createUser({ username, password });
        console.log('Signed up with:', { username });
        router.push('/login');
      }
    }, 1000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-headline font-bold text-gray-800">Create Your Account</h1>
      </div>

      <div className="relative w-full max-w-md">
        {/* Sign-up Card */}
        <Card className="relative z-20 w-full shadow-lg rounded-lg border-2 border-gray-200">
          <CardHeader>
            <div className="flex justify-between items-baseline">
              <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
              <CardDescription>
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Log in!
                </Link>
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white"
                />
              </div>
              <Button className="w-full bg-blue-300 hover:bg-blue-400 text-black text-lg" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Envelope */}
        <div className="absolute top-1/2 left-0 w-full h-1/2 pt-4">
            {/* Back part of the envelope */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-white border-2 border-gray-800 rounded-t-lg"
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 50%, 0 100%)' }}
            />
            {/* Top flap */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white border-b-2 border-gray-800"
                 style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            >
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-r-2 border-gray-800"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                />
            </div>
             {/* Left flap inner shadow */}
             <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-200"
                  style={{ clipPath: 'polygon(100% 0, 0 100%, 0 0)'}}
             />
             {/* Right flap inner shadow */}
             <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gray-200"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)'}}
             />
        </div>
      </div>
    </main>
  );
}
