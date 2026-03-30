import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import { ScanTextIcon } from "lucide-react"; // Removed FishIcon
import Link from "next/link";
import Image from "next/image"; // Import the Image component
import { FC } from "react";

export const NavBar: FC = () => {
  return (
    <>
      <div className="animate-in fade-in w-full">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center">
                {/* Replaced FishIcon with your logo */}
                <div className="relative w-20 h-30 mr-2">
                  {/* <Image
                    src="/autoteebooker-logo.png"
                    alt="AutoTBooker Logo"
                    fill
                    className="object-contain"
                    priority // Ensures the logo loads immediately as it's above the fold
                  /> */}
                </div>
                <span className="text-xl font-semibold tracking-tighter text-white-800 mr-6">
                  AutoTeeBooker
                </span>
              </div>
            </Link>
            <div className="hidden md:flex justify-between grow">
              <div />
              <div className="flex items-center space-x-4">
                <NavbarUserLinks />
              </div>
            </div>
            <div className="grow md:hidden flex justify-end">
              <NavbarMobile />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};