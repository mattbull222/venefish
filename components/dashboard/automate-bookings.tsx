import { FC } from "react";
import Image from "next/image";
import { MainNav } from "@/components/dashboard/main-nav";
import { RecentRounds } from "@/components/dashboard/recent-rounds";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export const Automate: FC = () => {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex items-end justify-between space-y-2 mb-6">
          <h2 className="text-3xl leading-5 font-bold tracking-tight">
            Dashboard
          </h2>
        </div>
        <div className="flex h-16 items-center bg-muted px-6 rounded-xl">
          <MainNav />
        </div>
        <div className="flex-1 space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Manage Automated Bookings</CardTitle>
                <CardDescription>
                  Create an automation that schedules a job to book a tee time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-1xl">Create Automation</div>
          
                

                
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Active Automations</CardTitle>
                <CardDescription>
                  You have the following active automations
                </CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Expired Automations</CardTitle>
                <CardDescription>
                  You have the following active automations
                </CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
