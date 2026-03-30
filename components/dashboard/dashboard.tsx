"use client";

import { FC, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, useFirestore, useFirestoreCollectionData, useFirestoreDocData } from "reactfire";
import { doc, collection, query, where, orderBy, limit, deleteDoc } from "firebase/firestore";
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
  Trash2,
  Users,
  AlertCircle
} from "lucide-react";

export const Dashboard: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id") ?? null;
  const { status: authStatus, data: user } = useUser();
  const firestore = useFirestore();

  const [isProvisioning, setIsProvisioning] = useState(!!sessionId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const userRef = doc(firestore, "users", user?.uid || "placeholder");
  const { data: userData } = useFirestoreDocData(userRef);

  const automationsRef = collection(firestore, "recurring_configs");
  const activeQuery = query(
    automationsRef, 
    where("userId", "==", user?.uid || "none"), 
    where("isActive", "==", true)
  );
  const { data: activeAutomations } = useFirestoreCollectionData(activeQuery, {
    idField: 'id'
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

  const handleCancelAutomation = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(firestore, "recurring_configs", id));
      toast.success("Schedule Removed", {
        description: "Your automatic booking has been deactivated."
      });
    } catch (error: any) {
      toast.error("Error", { description: "Failed to remove schedule." });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

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
        <h2 className="text-xl font-bold text-emerald-900">Initialising Your Agent...</h2>
        <p className="text-muted-foreground italic text-sm text-center px-6">Preparing your secure MiClub handshake and trial access.</p>
      </div>
    );
  }

  const nextExecution = activeAutomations?.[0] 
    ? `${activeAutomations[0].executionDay?.substring(0, 3)} ${activeAutomations[0].unlockTime}` 
    : "Standby";

  return (
    <div className="flex-col md:flex p-4 md:p-8 pt-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white-900 dark:text-white-50">Tee-Time Tracker</h2>
          <p className="text-sm text-muted-foreground">Manage your automatic weekly schedules and booking history.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 rounded-full w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700 uppercase">
            {userData?.subscriptionStatus === 'trialing' ? 'Free Trial Active' : 'Pro Member'}
          </span>
        </div>
      </div>

      <div className="hidden md:flex h-16 items-center bg-muted/50 px-6 rounded-xl mb-8">
        <MainNav />
      </div>

      {/* Top Statistic Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Schedules</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAutomations?.length || 0}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Running this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">System Status</CardTitle>
            <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Ready</div>
            <p className="text-[11px] text-muted-foreground mt-1">All systems online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Next Booking</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextExecution}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Upcoming attempt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Success Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Confirmed bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Active Schedules List */}
        <Card className="col-span-1 lg:col-span-4 border-emerald-100 dark:border-emerald-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              Your Weekly Schedules
            </CardTitle>
            <CardDescription>The system will automatically grab these spots for you.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeAutomations?.length ? (
              <div className="space-y-4">
                {activeAutomations.map((auto: any) => (
                  <div key={auto.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-muted/5 gap-4 transition-colors hover:bg-muted/10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="font-bold text-sm text-white-900 dark:text-white-50">{auto.course} ({auto.dayOfWeek}s)</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-emerald-600"/> Runs {auto.executionDay}s @ {auto.unlockTime}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-3 h-3 text-blue-600"/> {auto.players?.length} Players ({auto.leadTimeDays}d lead)</span>
                        <span className="flex items-center gap-1.5"><Target className="w-3 h-3 text-amber-600"/> Prefers {auto.timePreference}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {confirmDeleteId === auto.id ? (
                        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-8 text-[10px] uppercase font-bold"
                            onClick={() => handleCancelAutomation(auto.id)}
                            disabled={deletingId === auto.id}
                          >
                            {deletingId === auto.id ? "Stopping..." : "Confirm Stop"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-[10px] uppercase"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Keep
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => setConfirmDeleteId(auto.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                          Stop Schedule
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg bg-muted/5">
                <AlertCircle className="w-8 h-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground mb-4 font-medium">No active schedules found.</p>
                <Button onClick={() => router.push('/app/automate')} className="bg-emerald-600 hover:bg-emerald-700">Set Up Your First Schedule</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking History Sidebar */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="w-5 h-5 text-muted-foreground" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentRounds?.length ? (
                recentRounds.map((round: any) => (
                  <div key={round.id} className="flex items-start gap-4">
                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${round.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-emerald-950 dark:text-emerald-50">{round.course} — {round.actualTime || 'Searching'}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Booking for {new Date(round.date).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="text-[9px] font-bold bg-muted px-2 py-0.5 rounded-full uppercase shrink-0 border border-muted-foreground/10">
                      {round.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic py-8 text-center">Your booking history will appear here.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};