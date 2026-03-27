import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Loader2 } from "lucide-react";

const ApplicationPage = () => {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground italic">Loading Command Centre...</p>
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
};

export default ApplicationPage;