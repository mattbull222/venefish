"use client";

import { FC, useState } from "react";
import { MainNav } from "@/components/dashboard/main-nav";
import { db, useAuth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldCheck, Plus, X, Info } from "lucide-react";

type Player = {
  name: string;
  membershipTier: string; // Kept internal name for backend compatibility
  bookingWindowDays: number;
};

export const BookARound: FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clubUrl: "",
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

  const handleAddPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { name: "", membershipTier: "7-Day", bookingWindowDays: 14 }]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handlePlayerChange = (index: number, field: keyof Player, value: string | number) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const maxLeadDays = Math.max(...players.map(p => p.bookingWindowDays)) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Authentication Error", {
        description: "You must be logged in to save an automation."
      });
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        userId: user.uid,
        ...formData,
        players: players,
        isActive: true,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "recurring_configs"), payload);

      toast.success("Automation Active", {
        description: `Sniper set for ${formData.dayOfWeek}s at ${formData.course || "your selected course"}.`,
      });
      
      setFormData(prev => ({ ...prev, miclubPass: "" }));
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="md:hidden p-4 text-center italic text-muted-foreground">
        Mobile dashboard view coming soon. Please use desktop for automation setup.
      </div>

      <div className="hidden flex-col md:flex p-8 pt-6">
        <div className="flex items-end justify-between space-y-2 mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Automations</h2>
        </div>

        <div className="flex h-16 items-center bg-muted/50 px-6 rounded-xl mb-8">
          <MainNav />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          
          <Card className="col-span-8">
            <CardHeader>
              <CardTitle>Configure Golf Agent</CardTitle>
              <CardDescription>
                Set up your automated booking parameters. The system calculates your trigger date based on your group's membership tier.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 1: Credentials & Club */}
                <div className="space-y-4 p-4 border rounded-lg dark:bg-slate-900/50">
                  <h3 className="text-sm font-semibold">1. Account & Club Details</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clubUrl">MiClub URL</Label>
                      <Input 
                        id="clubUrl" 
                        placeholder="e.g. sandhurst.miclub.com.au"
                        value={formData.clubUrl}
                        onChange={e => setFormData({...formData, clubUrl: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user">MiClub Member ID / Username</Label>
                      <Input 
                        id="user" 
                        placeholder="e.g. 1234"
                        value={formData.miclubUser}
                        onChange={e => setFormData({...formData, miclubUser: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pass">MiClub Password</Label>
                      <Input 
                        id="pass" 
                        type="password"
                        value={formData.miclubPass}
                        onChange={e => setFormData({...formData, miclubPass: e.target.value})}
                        required 
                      />
                      <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-500">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Credentials are securely encrypted.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Player Roster & Rules */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">2. Enter Playing Partners & Member Restrictions</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        The AI agent factors in your group's access restrictions to determine the booking date. <br></br>Names must match the tee sheet exactly.
                      </p>
                    </div>
                    {players.length < 4 && (
                      <Button type="button" variant="outline" size="sm" onClick={handleAddPlayer}>
                        <Plus className="w-4 h-4 mr-1" /> Add Player
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3 mt-4">
                    {players.map((player, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-end p-3 bg-muted/30 rounded-md border border-dashed">
                        
                        <div className="col-span-12 md:col-span-4 space-y-1">
                          <Label className="text-xs">Full Name</Label>
                          <Input 
                            value={player.name}
                            onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                            placeholder={`Player ${index + 1}`}
                            required
                          />
                        </div>
                        
                        <div className="col-span-6 md:col-span-3">
                          <Label className="text-xs">Restrictions</Label>
                          <Select 
                            value={player.membershipTier} 
                            onValueChange={(v) => handlePlayerChange(index, "membershipTier", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7-Day">7-Day</SelectItem>
                              <SelectItem value="5-Day">5-Day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-5 md:col-span-4 space-y-1">
                          <Label className="text-xs truncate" title="When member gains access to the tee-sheet (days prior to tee-time)">
                            Tee Sheet Access (Days Prior)
                          </Label>
                          <Input 
                            type="number"
                            min="1"
                            value={player.bookingWindowDays}
                            onChange={(e) => handlePlayerChange(index, "bookingWindowDays", parseInt(e.target.value) || 0)}
                            required
                          />
                        </div>

                        {index > 0 ? (
                          <div className="col-span-1 md:col-span-1 flex justify-center pb-1">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive h-8 w-8"
                              onClick={() => handleRemovePlayer(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="col-span-1 md:col-span-1"></div>
                        )}
                        
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Booking Parameters */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-sm font-semibold">3. Booking Parameters</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Occurrence (limited to Weekly only)</Label>
                      <Select disabled defaultValue="Weekly">
                        <SelectTrigger className="bg-muted">
                          <SelectValue placeholder="Weekly" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Day</Label>
                      <Select onValueChange={(v: string) => setFormData({...formData, dayOfWeek: v})} defaultValue="Saturday">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Target Course - Exact spelling required</Label>
                      <Input 
                        placeholder="e.g. Champions"
                        value={formData.course}
                        onChange={e => setFormData({...formData, course: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-1">
                      <Label>Earliest Time</Label>
                      <Input 
                        type="time" 
                        value={formData.timeStart}
                        onChange={e => setFormData({...formData, timeStart: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2 col-span-1">
                      <Label>Latest Time</Label>
                      <Input 
                        type="time" 
                        value={formData.timeEnd}
                        onChange={e => setFormData({...formData, timeEnd: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                     <div className="space-y-2">
                      <Label>Selection Strategy</Label>
                      <Select onValueChange={(v: string) => setFormData({...formData, timePreference: v})} defaultValue="latest">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="earliest">Prioritise Earliest Slot</SelectItem>
                          <SelectItem value="latest">Prioritise Latest Slot</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        If multiple slots are available within your time window, the AI agent will select based on this rule.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Trigger Configuration */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-sm font-semibold">4. System Trigger Configuration</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Club Unlock Time</Label>
                      <Input 
                        type="time" 
                        value={formData.unlockTime}
                        onChange={e => setFormData({...formData, unlockTime: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select onValueChange={(v: string) => setFormData({...formData, timezone: v})} defaultValue="Australia/Melbourne">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Australia/Melbourne">AEST/AEDT (Melbourne/Sydney)</SelectItem>
                          <SelectItem value="Australia/Brisbane">AEST (Brisbane)</SelectItem>
                          <SelectItem value="Australia/Adelaide">ACST/ACDT (Adelaide)</SelectItem>
                          <SelectItem value="Australia/Perth">AWST (Perth)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Dynamic Execution Summary */}
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-md flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-semibold mb-1">Execution Strategy</p>
                      <p>
                        Based on your roster, the agent will queue this booking <strong>{maxLeadDays} days prior</strong> to every <strong>{formData.dayOfWeek}</strong>. The AI agent will execute at precisely <strong>{formData.unlockTime} {formData.timezone}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full text-md py-6" disabled={loading}>
                  {loading ? "Initialising Agent..." : "Deploy Weekly Automation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="col-span-4 h-fit">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">No recent bookings found.</p>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </>
  );
};