"use client";

import { FC, useState } from "react";
import { MainNav } from "@/components/dashboard/main-nav";
import { db } from "@/lib/firebase";
import { useUser } from "reactfire";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldCheck, Plus, X, Target, Clock, Users, ChevronRight, ChevronLeft, Zap, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

type Player = {
  name: string;
  membershipTier: string; 
  bookingWindowDays: number;
};

export const BookARound: FC = () => {
  const { data: user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    clubSubdomain: "",
    miclubUser: "",
    miclubPass: "",
    occurrence: "Weekly",
    dayOfWeek: "Saturday",
    course: "",
    timeStart: "07:00",
    timeEnd: "09:00",
    timePreference: "latest",
    unlockTime: "18:00",
    timezone: "Australia/Melbourne",
  });

  const [players, setPlayers] = useState<Player[]>([
    { name: "", membershipTier: "7-Day", bookingWindowDays: 14 }
  ]);

  const minLeadDays = Math.min(...players.map(p => p.bookingWindowDays)) || 0;

  const hasWeekendRestrictionWarning = 
    ["Saturday", "Sunday"].includes(formData.dayOfWeek) && 
    players.some(p => p.membershipTier === "5-Day");

  const isStep1Valid = !!formData.clubSubdomain && !!formData.miclubUser && !!formData.miclubPass;
  const isStep2Valid = players.every(p => p.name.trim() !== "" && p.bookingWindowDays > 0);
  const isStep3Valid = !!formData.timeStart && !!formData.timeEnd && !!formData.unlockTime && !!formData.course;

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePlayerChange = (index: number, field: keyof Player, value: string | number) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handleDeploy = async () => {
    if (!user) {
      toast.error("Auth Error", { description: "Please sign in to save your schedule." });
      return;
    }
    
    setLoading(true);

    try {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const targetDayIndex = daysOfWeek.indexOf(formData.dayOfWeek);
      const executionDayIndex = (targetDayIndex - (minLeadDays % 7) + 7) % 7;
      const executionDay = daysOfWeek[executionDayIndex];

      const cleanSubdomain = formData.clubSubdomain.trim().toLowerCase().replace(/^(https?:\/\/)/, "").split('.')[0];
      const finalUrl = `https://${cleanSubdomain}.miclub.com.au`;

      const payload = {
        userId: user.uid,
        ...formData,
        clubUrl: finalUrl,
        players: players,
        isActive: true,
        executionDay: executionDay, 
        leadTimeDays: minLeadDays,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "recurring_configs"), payload);

      toast.success("Schedule Active", {
        description: `Your agent is now watching for rounds every ${executionDay}.`,
      });
      
      // Navigate the user back to the Tee-Time Tracker dashboard
      router.push("/app");

    } catch (error: any) {
      toast.error("Error", { description: error.message });
      setLoading(false); // Only stop loading if it failed, otherwise the redirect handles it
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-8 pt-6">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white-900 dark:text-white-50">
          Set Up a Weekly Tee-Time Sniper
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us when you want to play, and we will handle the rest. <b>EVERY</b> week.
        </p>
      </div>

      <div className="hidden md:flex h-16 items-center bg-muted/50 px-6 rounded-xl mb-8 border border-muted-foreground/10">
        <MainNav />
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 px-4 relative">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-10" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
              step >= i ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-background border-muted text-muted-foreground'
            }`}>
              {i}
            </div>
          ))}
        </div>

        <Card className="shadow-lg border-muted-foreground/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              {step === 1 && "Your Club Account"}
              {step === 2 && "Your Playing Group"}
              {step === 3 && "Preferred Tee-Times"}
              {step === 4 && "Review Your Schedule"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Link your club account so our secure agent can book on your behalf."}
              {step === 2 && "Add your regular playing partners and their access levels."}
              {step === 3 && "Tell us when you usually like to tee off."}
              {step === 4 && "Please ensure your details are correct to avoid booking failures."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              {/* STEP 1: ACCOUNT */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <Label>Club Website Address</Label>
                    <div className="flex items-center w-full rounded-md border focus-within:ring-1 focus-within:ring-emerald-500 overflow-hidden bg-background">
                      <span className="bg-muted px-2 py-2 text-[10px] md:text-xs text-muted-foreground border-r shrink-0">https://</span>
                      <Input 
                        placeholder="sandhurst"
                        className="border-0 rounded-none focus-visible:ring-0 px-2 min-w-0 flex-1 h-9"
                        value={formData.clubSubdomain}
                        onChange={e => setFormData({...formData, clubSubdomain: e.target.value})}
                      />
                      <span className="bg-muted px-2 py-2 text-[10px] md:text-xs text-muted-foreground border-l shrink-0">.miclub.com.au</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Member ID / Username</Label>
                      <Input value={formData.miclubUser} onChange={e => setFormData({...formData, miclubUser: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" value={formData.miclubPass} onChange={e => setFormData({...formData, miclubPass: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PLAYERS */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  {players.map((player, index) => (
                    <div key={index} className="p-4 bg-muted/20 rounded-lg border border-dashed relative">
                      {index > 0 && (
                        <button onClick={() => setPlayers(players.filter((_, i) => i !== index))} className="absolute top-2 right-2 text-destructive hover:opacity-70">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div className="grid gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Full Name (Exactly as it appears at the club)</Label>
                          <Input 
                            placeholder="e.g. John Smith" 
                            value={player.name} 
                            onChange={(e) => handlePlayerChange(index, "name", e.target.value)} 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Membership Tier</Label>
                            <Select value={player.membershipTier} onValueChange={(v) => handlePlayerChange(index, "membershipTier", v)}>
                              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7-Day">7-Day</SelectItem>
                                <SelectItem value="5-Day">5-Day</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Booking Window (Days)</Label>
                            <Input 
                              type="number" 
                              placeholder="14" 
                              value={player.bookingWindowDays} 
                              onChange={(e) => handlePlayerChange(index, "bookingWindowDays", parseInt(e.target.value) || 0)} 
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed" onClick={() => players.length < 4 && setPlayers([...players, { name: "", membershipTier: "7-Day", bookingWindowDays: 14 }])}>
                    <Plus className="w-4 h-4 mr-2" /> Add Playing Partner
                  </Button>
                </div>
              )}

              {/* STEP 3: PREFERENCES */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <Label>Club Location / Timezone</Label>
                    <Select onValueChange={(v) => setFormData({...formData, timezone: v})} defaultValue={formData.timezone}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Australia/Melbourne">Melb / Syd / Hobart</SelectItem>
                        <SelectItem value="Australia/Brisbane">Brisbane (QLD)</SelectItem>
                        <SelectItem value="Australia/Adelaide">Adelaide (SA)</SelectItem>
                        <SelectItem value="Australia/Perth">Perth (WA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Course</Label>
                    <Input placeholder="e.g. Champions Course" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Day to Play</Label>
                      <Select onValueChange={(v) => setFormData({...formData, dayOfWeek: v})} defaultValue={formData.dayOfWeek}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Booking Open Time</Label>
                      <Input type="time" value={formData.unlockTime} onChange={e => setFormData({...formData, unlockTime: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Earliest Start</Label>
                      <Input type="time" value={formData.timeStart} onChange={e => setFormData({...formData, timeStart: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Latest Start</Label>
                      <Input type="time" value={formData.timeEnd} onChange={e => setFormData({...formData, timeEnd: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>If multiple times are free, prefer:</Label>
                    <Select onValueChange={(v) => setFormData({...formData, timePreference: v})} defaultValue={formData.timePreference}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="earliest">The earliest available time</SelectItem>
                        <SelectItem value="latest">The latest available time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  
                  {hasWeekendRestrictionWarning && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Restricted Member Warning</p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          You are booking for a weekend, but your group includes a 5-Day member. The club will likely block this booking unless everyone has 7-day privileges.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900 space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold uppercase text-emerald-700 font-mono">How it works</p>
                        <p className="text-sm text-emerald-900">The agent will wake up every <strong>{
                          ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
                            (["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(formData.dayOfWeek) - (minLeadDays % 7) + 7) % 7
                          ]
                        }</strong> at <strong>{formData.unlockTime}</strong> to grab your spot.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold uppercase text-emerald-700 font-mono">Your Booking</p>
                        <p className="text-sm text-emerald-900">{formData.dayOfWeek} round at {formData.course} between {formData.timeStart} and {formData.timeEnd}.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-emerald-600 mt-1" />
                      <div>
                        <p className="text-xs font-bold uppercase text-emerald-700 font-mono">Playing Group</p>
                        <p className="text-sm text-emerald-900">{players.length} Players (Waiting until {minLeadDays} days prior).</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={handleBack} disabled={step === 1 || loading}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            
            {step < 4 ? (
              <Button 
                onClick={handleNext} 
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
              >
                Next Step <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleDeploy} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {loading ? "Readying Agent..." : "Activate Sniper"} <Zap className="w-4 h-4 ml-2 fill-current" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};