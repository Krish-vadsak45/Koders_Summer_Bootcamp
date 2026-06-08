"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Moon,
  Radio,
  Sun,
  TimerReset,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

function getTimeParts(isTwentyFourHour: boolean) {
  const now = new Date();
  const hour = now.getHours();
  const displayHour = isTwentyFourHour ? hour : hour % 12 || 12;

  return {
    date: now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: String(displayHour).padStart(2, "0"),
    minute: String(now.getMinutes()).padStart(2, "0"),
    second: String(now.getSeconds()).padStart(2, "0"),
    meridiem: hour >= 12 ? "PM" : "AM",
  };
}

export function DigitalClock() {
  const [isMounted, setIsMounted] = useState(false);
  const [isTwentyFourHour, setIsTwentyFourHour] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const intervalId = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const time = useMemo(
    () => getTimeParts(isTwentyFourHour),
    [isTwentyFourHour, tick],
  );

  const displayTime = isMounted
    ? time
    : {
        date: "Loading local date",
        timezone: "Loading timezone",
        hour: "--",
        minute: "--",
        second: "--",
        meridiem: "AM",
      };

  return (
    <main className="clock-grid relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:py-10">
      <section className="w-full max-w-6xl">
        <div className="mb-3 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <p className="inline-flex items-center gap-2 rounded-md border border-white/80 bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur">
              <Clock3 className="h-4 w-4 text-primary" />
              Live local time
            </p>
            <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
              Digital Clock
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/80 bg-white/80 p-1 shadow-lg shadow-slate-300/30 backdrop-blur sm:w-auto">
            <Button
              variant={!focusMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setFocusMode(false)}
              className="h-10 px-4"
            >
              <Sun className="h-4 w-4" />
              Standard
            </Button>
            <Button
              variant={focusMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setFocusMode(true)}
              className="h-10 px-4"
            >
              <Moon className="h-4 w-4" />
              Focus
            </Button>
          </div>
        </div>

        <Card
          className={cn(
            "overflow-hidden border-white/80 bg-white/[0.78] shadow-2xl shadow-slate-300/50 backdrop-blur-xl",
            focusMode && "border-slate-900/60 bg-slate-950 text-white shadow-glow",
          )}
        >
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_390px]">
              <section
                className={cn(
                  "relative flex min-h-[305px] flex-col justify-between overflow-hidden p-5 sm:min-h-[460px] sm:p-8 lg:min-h-[560px] lg:p-10",
                  focusMode
                    ? "bg-[radial-gradient(circle_at_72%_10%,rgba(20,184,166,0.22),transparent_19rem),linear-gradient(135deg,#050816_0%,#07111f_100%)]"
                    : "bg-[radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.16),transparent_18rem),linear-gradient(135deg,rgba(255,255,255,0.62),rgba(226,239,242,0.72))]",
                )}
              >
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div
                    className={cn(
                    "inline-flex items-center gap-2 rounded-md border border-white/70 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur sm:text-sm",
                      focusMode &&
                        "border-white/10 bg-white/[0.06] text-slate-300 shadow-none",
                    )}
                  >
                    <CalendarDays className="h-4 w-4 text-secondary" />
                    {displayTime.date}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Refresh clock"
                    onClick={() => setTick((value) => value + 1)}
                    className={cn(
                      "h-9 w-9 border-white/70 bg-white/70 shadow-sm backdrop-blur sm:h-10 sm:w-10",
                      focusMode &&
                        "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]",
                    )}
                  >
                    <TimerReset className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative z-10 py-4 sm:py-10">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <span className="font-mono text-[clamp(3.4rem,17vw,9.5rem)] font-semibold leading-none tracking-normal">
                      {displayTime.hour}
                    </span>
                    <span className="flex flex-col gap-5 sm:gap-6">
                      <span className="h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_28px_rgba(20,184,166,0.7)] sm:h-5 sm:w-5" />
                      <span className="h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_28px_rgba(20,184,166,0.7)] sm:h-5 sm:w-5" />
                    </span>
                    <span className="font-mono text-[clamp(3.4rem,17vw,9.5rem)] font-semibold leading-none tracking-normal">
                      {displayTime.minute}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5 sm:gap-4">
                    <div
                      className={cn(
                        "rounded-lg border border-slate-950 bg-slate-950 px-3.5 py-2.5 font-mono text-2xl font-semibold leading-none text-white shadow-lg shadow-slate-300/40 sm:px-4 sm:py-3 sm:text-3xl",
                        focusMode &&
                          "border-white/20 bg-white/[0.08] shadow-none backdrop-blur",
                      )}
                    >
                      {displayTime.second}
                    </div>
                    {!isTwentyFourHour && (
                      <div className="rounded-lg bg-secondary px-3.5 py-2.5 text-lg font-bold leading-none text-secondary-foreground shadow-lg shadow-amber-300/30 sm:px-4 sm:py-3 sm:text-xl">
                        {displayTime.meridiem}
                      </div>
                    )}
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 rounded-md border border-white/70 bg-white/55 px-3 py-2 text-xs font-semibold text-slate-600 backdrop-blur sm:text-sm",
                        focusMode &&
                          "border-white/10 bg-white/[0.06] text-slate-300",
                      )}
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      {displayTime.timezone}
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "relative z-10 hidden grid-cols-3 gap-3 border-t border-slate-900/10 pt-5 text-sm sm:grid",
                    focusMode && "border-white/10",
                  )}
                >
                  <div>
                    <p className="font-medium text-muted-foreground">Hour</p>
                    <p className="mt-1 font-mono text-2xl font-semibold">
                      {displayTime.hour}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Minute</p>
                    <p className="mt-1 font-mono text-2xl font-semibold">
                      {displayTime.minute}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Second</p>
                    <p className="mt-1 font-mono text-2xl font-semibold">
                      {displayTime.second}
                    </p>
                  </div>
                </div>
              </section>

              <aside className="border-t border-white/10 bg-slate-950 p-5 text-white sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <div className="flex h-full flex-col justify-between gap-4 sm:gap-7">
                  <div className="flex flex-col items-center">
                    <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] sm:h-64 sm:w-64 lg:h-72 lg:w-72">
                      <div className="absolute h-[88%] w-[88%] rounded-full border border-primary/35 animate-pulseRing" />
                      <div className="absolute h-[72%] w-[72%] rounded-full border border-white/10" />
                      <div className="absolute h-[56%] w-[56%] rounded-full border border-white/[0.08]" />
                      <div className="absolute h-3 w-3 rounded-full bg-secondary shadow-[0_0_30px_rgba(245,158,11,0.85)]" />
                      <div className="absolute h-[42%] w-1 origin-bottom -translate-y-1/2 rounded-full bg-primary shadow-[0_0_22px_rgba(20,184,166,0.65)] animate-sweep" />
                      <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-normal text-slate-400">
                          Seconds
                        </p>
                        <p className="font-mono text-4xl font-semibold leading-none sm:text-6xl">
                          {displayTime.second}
                        </p>
                      </div>
                    </div>

                    <div className="hidden w-full border-t border-white/10 pt-6 sm:mt-7 sm:block">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                          <Radio className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-400">
                            Current mode
                          </p>
                          <p className="text-xl font-semibold">
                            {focusMode ? "Focus" : "Standard"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3 sm:gap-4 sm:p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-100">
                        24-hour format
                      </span>
                      <Switch
                        checked={isTwentyFourHour}
                        onCheckedChange={setIsTwentyFourHour}
                        aria-label="Toggle 24-hour format"
                      />
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Display</span>
                      <span className="font-semibold text-white">
                        {isTwentyFourHour ? "24H" : "12H"}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
