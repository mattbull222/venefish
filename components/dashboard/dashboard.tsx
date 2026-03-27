"use client";

import { FC, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, useFirestore, useFirestoreCollectionData, useFirestoreDocData } from "reactfire";
import { doc, collection, query, where, orderBy, limit } from "firebase/firestore";
import { MainNav } from "@/components/dashboard/main-nav";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Loader2, 
  Target, 
  History, 
  Zap, 
  ShieldCheck, 
  Clock, 
  CalendarDays,
  ExternalLink 
} from "lucide-react";

export const Dashboard: FC = () => {
  const router = useRouter();
const searchParams = useSearchParams();
const sessionId = searchParams?.get("session_id") ?? null;
  const { status: authStatus, data: user } = useUser();
  const firestore = useFirestore();

  // --- 1. PROVISIONING STATE ---
  const [isProvisioning, setIsProvisioning] = useState(!!sessionId);

  // --- 2. LIVE DATA SUBSCRIPTIONS ---
  const userRef = doc(firestore, "users", user?.uid || "placeholder");
  const { data: userData } = useFirestoreDocData(userRef);

  const automationsRef = collection(firestore, "recurring_configs");
  const activeQuery = query(
    automationsRef, 
    where("userId", "==", user?.uid || "none"), 
    where("isActive", "==", true)
  );
  const { data: activeAutomations } = useFirestoreCollectionData(activeQuery, {
  idField: 'id' // This maps the Firestore Document ID to an 'id' property
});

  const historyRef = collection(firestore, "bookings");
  const historyQuery = query(
    historyRef, 
    where("userId", "==", user?.uid || "none"), 
    orderBy("createdAt", "desc"), 
    limit(5)
  );
  const { data: recentRounds } = useFirestoreCollectionData(historyQuery, {
  idField: 'id' 
});

  // --- 3. HANDLE STRIPE REDIRECT ---
  useEffect(() => {
    if (sessionId) {
      toast.success("Payment Verified", { 
        description: "Initialising your 14-day free trial..." 
      });
      
      const timer = setTimeout(() => {
        setIsProvisioning(false);
        router.replace("/app"); 
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [sessionId, router]);

  if (isProvisioning) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <h2 className="text-xl font-bold">Initialising Sniper Engine...</h2>
        <p className="text-muted-foreground italic text-sm">Configuring your trial and secure MiClub handshake.</p>
      </div>
    );
  }

  return (
    <div className="flex-col md:flex p-8 pt-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Command Centre</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700 uppercase">
            {userData?.subscriptionStatus === 'trialing' ? 'Trial Mode' : 'Pro Subscriber'}
          </span>
        </div>
      </div>

      <div className="flex h-16 items-center bg-muted/50 px-6 rounded-xl mb-8">
        <MainNav />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Snipers</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAutomations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active recurring configs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Optimal</div>
            <p className="text-xs text-muted-foreground">Worker nodes standing by</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Execution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18:00:01</div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Local Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Content: Automated Tasks */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              Active Automations
            </CardTitle>
            <CardDescription>Recurring weekly booking schedules</CardDescription>
          </CardHeader>
          <CardContent>
            {activeAutomations?.length ? (
              <div className="space-y-4">
                {activeAutomations.map((auto: any) => (
                  <div key={auto.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-bold text-sm">{auto.dayOfWeek}s — {auto.course}</p>
                      <p className="text-xs text-muted-foreground">Target window: {auto.timeStart} to {auto.timeEnd}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/app/automations')}>
                      Manage <ExternalLink className="ml-2 w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">No snipers deployed.</p>
                <Button onClick={() => router.push('/app/automate')}>Configure First Round</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar: Round History */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentRounds?.length ? (
                recentRounds.map((round: any) => (
                  <div key={round.id} className="flex items-start gap-4">
                    <div className={`mt-1 h-2 w-2 rounded-full ${round.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{round.course} - {round.actualTime || 'Pending'}</p>
                      <p className="text-xs text-muted-foreground">Played on {new Date(round.date).toLocaleDateString('en-AU')}</p>
                    </div>
                    <div className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded uppercase">
                      {round.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic py-4 text-center">No rounds booked yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};