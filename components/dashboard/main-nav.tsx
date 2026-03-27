'use client';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/app"
        className={cn("text-sm font-medium transition-colors hover:text-primary", {
          "text-muted-foreground": !isActive("/app")
        })}
      >
        Overview
      </Link>
      <Link
        href="/app/automate"
        className={cn("text-sm font-medium transition-colors hover:text-primary", {
          "text-muted-foreground": !isActive("/app/automate")
        })}
      >
        Automate Bookings
      </Link>
    </nav>
  );
}