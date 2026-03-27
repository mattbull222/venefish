import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar/navbar";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner"; // <-- Sonner import added

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in">
      <NavBar />
      <div className="flex flex-col grow h-full">{children}</div>
      <Footer />
      {/* Mount Sonner here to capture toasts across all child pages */}
      <Toaster richColors position="top-right" />
    </div>
  );
}