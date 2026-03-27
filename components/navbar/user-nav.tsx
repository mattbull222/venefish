"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useUser } from "reactfire";
import { Loader2, CreditCard, LogOut, User, Settings, PlusCircle } from "lucide-react";

export function UserNav() {
  const { data: user } = useUser();
  const router = useRouter();
  const [isBillingLoading, setIsBillingLoading] = useState(false);

  const doLogout = async () => {
    await signOut(getAuth());
    toast({
      title: "Logged out",
      description: "You have been logged out.",
    });
    router.replace("/");
  };

  const handleBilling = async () => {
    if (!user?.uid) return;
    
    setIsBillingLoading(true);
    try {
      const response = await fetch("/api/create-portal-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);

      // Send them to the Stripe Portal
      window.location.assign(url);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Billing Error",
        description: err.message || "Could not open the billing portal.",
      });
      setIsBillingLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.photoURL || "/avatars/04.png"}
              alt="User avatar"
            />
            <AvatarFallback>
              {user?.displayName?.slice(0, 2) || user?.email?.slice(0, 2) || "GA"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.displayName ||
                user?.email?.slice(0, user?.email?.indexOf("@")) ||
                "Anonymous"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleBilling} disabled={isBillingLoading}>
            {isBillingLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            <span>Billing</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={doLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}