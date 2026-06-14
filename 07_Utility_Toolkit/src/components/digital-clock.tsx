"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

export function DigitalClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setTime(new Date()), 0);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  if (!time) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Digital Clock</CardTitle>
          <CardDescription>Loading time...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-5xl font-mono opacity-50">--:--:--</div>
        </CardContent>
      </Card>
    );
  }

  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24Hour,
  });

  const dateString = time.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full max-w-md mx-auto border-none shadow-none bg-transparent sm:border-solid sm:shadow-sm sm:bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Digital Clock</CardTitle>
        <CardDescription>Real-time digital clock display</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8 rounded-xl bg-secondary/50">
          <div className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-primary">
            {timeString}
          </div>
          <div className="text-muted-foreground mt-4 font-medium">
            {dateString}
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <Label htmlFor="format-toggle" className="cursor-pointer font-medium">Use 24-hour format</Label>
          <Switch 
            id="format-toggle" 
            checked={is24Hour} 
            onCheckedChange={setIs24Hour} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
