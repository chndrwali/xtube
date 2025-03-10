'use client';

import { UserCircleIcon } from 'lucide-react';
import { UserButton, SignInButton, SignedOut, SignedIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export const AuthButton = () => {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" className="px-4 py-2 font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none [&_svg]:size-5">
            <UserCircleIcon />
            Masuk
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
