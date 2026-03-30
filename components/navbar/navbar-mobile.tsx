"use client";

import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export const NavbarMobile = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-6 pt-12">
        <SheetHeader className="text-left">
          <SheetTitle className="text-emerald-900">Navigation</SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col space-y-4">
          <Link 
            href="/app" 
            className="text-lg font-medium hover:text-emerald-600 transition-colors"
          >
            Dashboard
          </Link>
          {/* Add other links here as needed */}
        </nav>

        <div className="mt-auto pb-8 border-t pt-6">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Account
            </p>
            <NavbarUserLinks />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};