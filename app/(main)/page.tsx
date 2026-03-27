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

export default function Home() {
  return (
    <main className="flex flex-col item-center justify-between">
      <div className="relative w-full">
      <div className="absolute -z-10 w-full">
        <Image
        src={background} alt="background image" className="w-full fixed"/>
      </div>  
      </div>  
      <div className="grow flex flex-col items-center justify-evenly">
        <section className="space-y-6">
          <div className="container flex flex-col items-center gap-8 text-center">
            {/* <Badge variant="secondary">Now using the app router!</Badge> */}
            <br></br>
            <img src="AutoTeeBookerLogoWhite.png"></img>
            {/* <Badge className="space-x-4 font-normal text-sm">
              <p>
                <span className="font-bold">Ve</span>rcel
              </p>
              <p>
                <span className="font-bold">Ne</span>xt.js
              </p>
              <p>
                <span className="font-bold">Fi</span>rebase
              </p>
              <p>
                <span className="font-bold">sh</span>adcn/ui
              </p>
            </Badge> */}
            <h1 className="max-w-4xl font-heading font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-magnolia">
            Swing Easy, Book Easier.
            </h1>
            <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-white">
            Your ultimate solution for hassle-free golf tee time bookings, tailored for your convenience and seamless scheduling every round.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg">View Demo</Button>
              </Link>
              {/* <Link target="_blank" href="https://github.com/enesien/venefish">
                <Button size="lg" variant="link">
                  View Project on GitHub &rarr;
                </Button>
              </Link> */}
            </div>
          </div>
        </section>
        <section className="container mt-8">
  <div className="grid lg:grid-cols-1 gap-6 items-center">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      <div>
        <Card className=" shadow-teal-200 shadow-md border-teal-400">
          <CardHeader>
            <CardTitle>AutoTeeBooker: Your Hassle-Free Golf Tee Time Partner</CardTitle>
            {/* <CardDescription>
              Check out BestParse/AI for all your parsing needs.
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <p className="mt-4">
            Experience effortless golf tee time scheduling with AutoTeeBooker, the app designed to simplify your golfing adventures. Tailored for golfers who crave convenience, AutoTeeBooker takes the stress out of securing tee times at your favourite courses, including those using the MiClub booking system.
            </p>
            <br></br>
            <p>
            With AutoTeeBooker, booking your next round is as easy as setting your preferences. Simply input details such as your desired course, date, time, and number of players, and let AutoTeeBooker handle the rest. It swiftly reserves your preferred tee time the moment it becomes available, ensuring you never miss out on your ideal slot.
            </p>
            <br></br>
            <p>
            Rest assured, your login credentials are encrypted and stored securely, prioritizing the safety of your information.
            </p>
            <br></br>
            <p>
            Say goodbye to constant website monitoring and last-minute rushes. AutoTeeBooker streamlines the booking process, giving you more time to focus on perfecting your swing and enjoying the game you love.
            <br></br>
            </p>
            <br></br>
            <p>
            Let AutoTeeBooker be your go-to companion for stress-free golf tee time bookings. Create your account now and unlock a world of convenience on the green.
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className=" shadow-slate-200 shadow-md border-slate-400">
          <CardHeader>
            <CardTitle>Key Features:</CardTitle>
            {/* <CardDescription>
              Use JobLogr for free to track your job applications.
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <ul>
                <li><strong className="font-semibold">Real-time Alerts:</strong> Get notified when tee times are available based on your preferences.</li>
                <li><strong className="font-semibold">Automated Bookings:</strong> Secures your preferred tee times without the need for manual intervention, so you can spend less time booking and more time playing.</li>
                <li><strong className="font-semibold">Personalized Scheduling:</strong> Set your preferences effortlessly and let AutoTeeBooker find the best tee times to match your needs.</li>
                <li><strong className="font-semibold">Compatible with MiClub Courses:</strong> Works seamlessly with courses using MiClub booking systems, ensuring compatibility with your favorite courses.</li>
                <li><strong className="font-semibold">Membership Integration:</strong> Recognises your membership details to access exclusive tee times and benefits, providing a tailored booking experience.</li>
              </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  <div>
    
  </div>
</section>
      </div>
      </main>
  );
}
