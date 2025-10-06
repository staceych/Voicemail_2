
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // We are using a dummy domain to use Firebase email/password auth with a username
    const email = `${username}@voicemail.app`;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('Logged in with:', user);
        router.push('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorCode, errorMessage);
        toast({
          title: 'Login Failed',
          description: 'Please check your username and password and try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-headline font-bold text-gray-800">Welcome to VoiceMail</h1>
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <Card className="relative z-20 w-full shadow-lg rounded-lg border-2 border-gray-200">
          <CardHeader>
            <div className="flex justify-between items-baseline">
              <CardTitle className="text-3xl font-bold">Login</CardTitle>
              <CardDescription>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up!
                </Link>
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleLogin}>
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
              <div className="flex items-center space-x-2">
                <Checkbox id="keep-logged-in" />
                <Label htmlFor="keep-logged-in" className="font-normal">
                  Keep me logged in
                </Label>
              </div>
              <Button className="w-full bg-blue-300 hover:bg-blue-400 text-black text-lg" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
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
