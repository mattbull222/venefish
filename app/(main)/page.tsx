import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import background from "../../public/AutoTeeBooker-bg.jpg";
import { CheckCircle2, Zap, ShieldCheck, Clock, Target } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="relative w-full">
        <div className="absolute -z-10 w-full h-full">
          <Image
            src={background}
            alt="Golf course background"
            fill
            className="object-cover fixed opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-background/20 fixed" />
        </div>
      </div>

      <div className="grow flex flex-col items-center justify-evenly w-full py-12 md:py-24">
        <section className="space-y-6 px-6">
          <div className="container flex flex-col items-center gap-8 text-center">
            <img src="autoteebooker-logo.png" alt="AutoTeeBooker Logo" className="h-32 md:h-48" />
            
            <Badge variant="outline" className="border-emerald-500 text-emerald-400 py-1 px-4 text-sm animate-pulse">
              Free 14-Day Trial Available Now
            </Badge>

            <h1 className="max-w-4xl font-heading font-bold text-4xl sm:text-6xl md:text-7xl tracking-tighter text-white">
              Stop Fighting the Refresh Button.
            </h1>
            
            <p className="max-w-2xl leading-normal text-slate-200 sm:text-xl sm:leading-8">
              AutoTeeBooker is the automatic tee-time "Sniper" for your club's tee sheet. Set your preferred Saturday morning slot once, and let our booking agents grab it the millisecond it opens.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg shadow-xl shadow-emerald-900/20">
                  Start Your 14-Day Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-white border-white/20 bg-white/5 hover:bg-white/10 px-8 py-6 text-lg">
                  How it Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container mt-20 px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Value Proposition Card */}
            <Card className="lg:col-span-7 bg-background/60 backdrop-blur-md border-emerald-500/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-emerald-500">Built for the Weekly Regular</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-slate-200">
                <p>
                  We know the drill: Saturday bookings open at 6:00 PM on Wednesday. If you aren't logged in and clicking within seconds, you're playing at 2:00 PM or not playing at all.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm"><strong>Win the Refresh War:</strong> Our Agent fires exactly at the club's unlock time.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm"><strong>Set and Forget:</strong> Configure your weekly schedule once and never log in to MiClub again.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm"><strong>Group Friendly:</strong> Add up to 4 partners. We validate any membership restrictions for you.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm"><strong>Secure Handshake:</strong> Your credentials are encrypted and used only for your specific bookings.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature List Card */}
            <Card className="lg:col-span-5 bg-background/60 backdrop-blur-md border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">The Tracker Advantage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Zap className="w-4 h-4 text-emerald-500" /></div>
                    <span className="text-sm font-medium">Automated "Sniper" Bookings</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><Target className="w-4 h-4 text-blue-500" /></div>
                    <span className="text-sm font-medium">Earliest/Latest Slot Preference</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg"><Clock className="w-4 h-4 text-amber-500" /></div>
                    <span className="text-sm font-medium">Real-time Activity Log</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg"><ShieldCheck className="w-4 h-4 text-purple-500" /></div>
                    <span className="text-sm font-medium">MiClub System Compatibility</span>
                  </li>
                </ul>
                
                <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                  <p className="text-xs font-bold text-emerald-500 uppercase">Special Offer</p>
                  <p className="text-sm text-slate-300 mt-1">Get 14 days of full access. See why hundreds of golfers never book manually anymore.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}