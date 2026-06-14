import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DigitalClock } from "@/components/digital-clock";
import { PasswordGenerator } from "@/components/password-generator";
import { TipCalculator } from "@/components/tip-calculator";
import { Wrench } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto py-12 px-4 max-w-3xl min-h-screen">
      <div className="flex flex-col items-center mb-12 space-y-4 text-center mt-8">
        <div className="bg-primary/10 p-4 rounded-full">
          <Wrench className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Utility Toolkit
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Three essential everyday tools combined into one seamless experience.
        </p>
      </div>

      <Tabs
        defaultValue="clock"
        className="w-full bg-card/50 p-1 sm:p-6 rounded-xl sm:border sm:shadow-sm"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 bg-muted/50 rounded-lg">
          <TabsTrigger
            value="clock"
            className="text-sm py-3 rounded-md data-[state=active]:shadow-sm"
          >
            Clock
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="text-sm py-3 rounded-md data-[state=active]:shadow-sm"
          >
            Password
          </TabsTrigger>
          <TabsTrigger
            value="tip"
            className="text-sm py-3 rounded-md data-[state=active]:shadow-sm"
          >
            Tip Calc
          </TabsTrigger>
        </TabsList>
        <div className="pt-2 pb-6">
          <TabsContent
            value="clock"
            className="mt-0 outline-none animate-in fade-in-50 duration-500"
          >
            <DigitalClock />
          </TabsContent>
          <TabsContent
            value="password"
            className="mt-0 outline-none animate-in fade-in-50 duration-500"
          >
            <PasswordGenerator />
          </TabsContent>
          <TabsContent
            value="tip"
            className="mt-0 outline-none animate-in fade-in-50 duration-500"
          >
            <TipCalculator />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
