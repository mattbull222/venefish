"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { FC, useState } from "react";
import { useAuth } from "reactfire";
import { Loader2 } from "lucide-react";

interface Props {
  onSignIn?: () => void;
}

export const ProviderLoginButtons: FC<Props> = ({ onSignIn }) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const doProviderSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      
      // 1. Trigger the Firebase Popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 2. Check if this is a brand new user
      const additionalInfo = getAdditionalUserInfo(result);
      
      if (additionalInfo?.isNewUser) {
        toast({ 
          title: "Welcome to Golf Agent!", 
          description: "Setting up your 14-day free trial..." 
        });

        // 3. Bounce to Stripe Trial Checkout
        const response = await fetch('/api/create-subscription-trial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            uid: user.uid,
            email: user.email 
          }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return; // Don't call onSignIn yet
        }
      }

      // If existing user, proceed to dashboard
      toast({ title: "Signed in!" });
      onSignIn?.();

    } catch (err: any) {
      console.error(err);
      toast({ 
        variant: "destructive", 
        title: "Error signing in", 
        description: err.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={doProviderSignIn}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 488 512"
            fill="currentColor"
            className="mr-2"
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
        )}
        Continue with Google
      </Button>
    </div>
  );
};