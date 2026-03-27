'use client';

import * as React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FC, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "reactfire";
import { Loader2, Rocket } from "lucide-react"; // Added for better UX

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

interface SignUpFormProps {
  onShowLogin: () => void;
  onSignUp?: () => void;
}

export const SignUpForm: FC<SignUpFormProps> = ({ onShowLogin, onSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signup = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // 1. Create Firebase User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user?.uid) {
        toast({ title: "Account created!", description: "Redirecting to secure trial setup..." });

        // 2. Call your Cloud Function or API route to get Stripe URL
        // Replace with your actual endpoint URL
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
          // 3. Send them to Stripe to start the 14-day trial
          window.location.href = data.url;
        } else {
          toast({ variant: "destructive", title: "Checkout Error", description: "Failed to load payment portal." });
        }
      }
    } catch (err: any) {
      if (err.code?.includes("already")) {
        toast({ title: "User already exists", description: "Try signing in instead." });
      } else {
        toast({ variant: "destructive", title: "Error signing up", description: err.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 space-y-2">
        <h3 className="text-2xl font-bold">Start Your 14-Day Free Trial</h3>
        <p className="text-sm text-muted-foreground">
          Deploy your first golf sniper in minutes. No charges for 2 weeks.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(signup)}>
          <fieldset disabled={isLoading} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="matt@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a secure password (min 8 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Securing Trial...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Begin 2-Week Free Trial
                </>
              )}
            </Button>
          </fieldset>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button variant="link" className="p-0 h-auto" onClick={onShowLogin}>
          Sign in here.
        </Button>
      </p>
    </>
  );
};