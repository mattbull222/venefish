import { AuthCard } from "@/components/auth-card";
import { ProviderLoginButtons } from "@/components/auth/provider-login-buttons";
import { OrSeparator } from "@/components/ui/or-separator";

export default function LoginPage() {
  return (
    // Use px-4 to ensure the card doesn't touch the screen edges on mobile
    <div className="grow flex flex-col items-center justify-center px-4 py-8">
      {/* Changed w-[32rem] to w-full max-w-md */}
      <section className="w-full max-w-md space-y-6">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to manage your tee-time schedules.
          </p>
        </div>
        
        <div className="bg-background/50 backdrop-blur-sm border rounded-xl p-1 shadow-sm">
           <AuthCard />
        </div>

        <OrSeparator />
        
        <ProviderLoginButtons />
      </section>
    </div>
  );
}