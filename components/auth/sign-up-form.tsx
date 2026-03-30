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
import { Loader2, Rocket } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(100),
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user?.uid) {
        toast({ title: "Account created!", description: "Redirecting to secure trial setup." });
        const response = await fetch('/api/create-subscription-trial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, email: user.email }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast({ variant: "destructive", title: "Checkout Error", description: "Failed to load payment portal." });
        }
      }
    } catch (err: any) {
      if (err.code?.includes("already")) {
        toast({ title: "Account exists", description: "Please try signing in instead." });
      } else {
        toast({ variant: "destructive", title: "Error signing up", description: err.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header section with forced wrapping */}
      <div className="mb-6 space-y-2 text-center md:text-left">
        <h3 className="text-2xl font-bold text-white-900 dark:text-white-50 tracking-tight break-words">
          Start Your 14-Day Free Trial
        </h3>
        <p className="text-sm text-muted-foreground whitespace-normal break-words">
          Deploy your first schedule in minutes. No charges for 2 weeks.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(signup)} className="space-y-4 w-full overflow-hidden">
          {/* fieldset min-w-0 is vital for mobile Safari/Chrome */}
          <fieldset disabled={isLoading} className="space-y-4 min-w-0 w-full border-0 p-0 m-0">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5 w-full">
                  <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. matt@example.com" 
                      type="email" 
                      className="h-11 md:h-10 w-full"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5 w-full">
                  <FormLabel className="text-sm font-semibold">Create Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      className="h-11 md:h-10 w-full"
                      {...field} 
                    />
                  </FormControl>
                  {/* FormDescription can sometimes cause stretching; whitespace-normal fixes this */}
                  <FormDescription className="text-[11px] leading-tight whitespace-normal break-words">
                    Must be at least 8 characters.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full py-6 md:py-4 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-[0.98]" 
              size="lg"
            >
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

      <div className="mt-8 pt-6 border-t border-border/40">
        <p className="text-center text-sm text-muted-foreground whitespace-normal">
          Already have an account?{" "}
          <button 
            type="button"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4" 
            onClick={onShowLogin}
          >
            Sign in here.
          </button>
        </p>
      </div>
    </div>
  );
};