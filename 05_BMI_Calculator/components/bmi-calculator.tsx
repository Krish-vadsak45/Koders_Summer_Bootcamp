"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clipboard,
  History,
  Moon,
  RotateCcw,
  Save,
  Scale,
  Sun,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type UnitSystem = "metric" | "imperial";
type ThemeName = "day" | "night" | "pulse";

type BmiCategory = {
  label: string;
  range: string;
  description: string;
  color: string;
  textColor: string;
};

type SavedResult = {
  id: string;
  bmi: number;
  category: string;
  unit: UnitSystem;
  weightLabel: string;
  heightLabel: string;
  createdAt: string;
};

const STORAGE_KEY = "bmi-calculator-recent-results";

const CATEGORIES: BmiCategory[] = [
  {
    label: "Underweight",
    range: "< 18.5",
    description: "Fuel up with a steady nutrition plan.",
    color: "bg-sky-500",
    textColor: "text-sky-700",
  },
  {
    label: "Healthy",
    range: "18.5 - 24.9",
    description: "Inside the common adult target range.",
    color: "bg-emerald-600",
    textColor: "text-emerald-700",
  },
  {
    label: "Overweight",
    range: "25 - 29.9",
    description: "Small habit changes can help.",
    color: "bg-amber-500",
    textColor: "text-amber-700",
  },
  {
    label: "Obesity",
    range: "30+",
    description: "Professional guidance can help.",
    color: "bg-rose-600",
    textColor: "text-rose-700",
  },
];

const THEMES: Record<
  ThemeName,
  {
    label: string;
    icon: typeof Sun;
    shell: string;
    panel: string;
    accent: string;
    text: string;
  }
> = {
  day: {
    label: "Day",
    icon: Sun,
    shell:
      "bg-[radial-gradient(circle_at_10%_10%,rgba(14,116,144,0.22),transparent_28rem),linear-gradient(135deg,#f8fafc,#ecfeff_54%,#fff7ed)] text-slate-950",
    panel: "bg-white/88 border-slate-200",
    accent: "bg-cyan-700 text-white",
    text: "text-slate-600",
  },
  night: {
    label: "Night",
    icon: Moon,
    shell:
      "bg-[radial-gradient(circle_at_18%_10%,rgba(45,212,191,0.26),transparent_24rem),linear-gradient(135deg,#07111f,#102337_52%,#2d1834)] text-slate-50",
    panel: "bg-slate-950/72 border-slate-700 text-slate-50",
    accent: "bg-teal-400 text-slate-950",
    text: "text-slate-300",
  },
  pulse: {
    label: "Pulse",
    icon: Activity,
    shell:
      "bg-[radial-gradient(circle_at_20%_10%,rgba(244,63,94,0.24),transparent_25rem),linear-gradient(135deg,#fff1f2,#fff7ed_45%,#ecfeff)] text-slate-950",
    panel: "bg-white/84 border-rose-200",
    accent: "bg-rose-600 text-white",
    text: "text-slate-600",
  },
};

const DEFAULT_METRIC = {
  weightKg: "70",
  heightCm: "170",
};

const DEFAULT_IMPERIAL = {
  weightLb: "154",
  heightFt: "5",
  heightIn: "7",
};

function parsePositiveNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10;
}

function getCategory(bmi: number) {
  if (bmi < 18.5) return CATEGORIES[0];
  if (bmi < 25) return CATEGORIES[1];
  if (bmi < 30) return CATEGORIES[2];
  return CATEGORIES[3];
}

function getBmiPosition(bmi: number) {
  const clamped = Math.min(Math.max(bmi, 12), 42);
  return `${((clamped - 12) / 30) * 100}%`;
}

function Field({
  id,
  label,
  value,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  suffix: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="space-y-1">
      <span className="text-[0.68rem] font-semibold uppercase tracking-normal text-muted-foreground">
        {label}
      </span>
      <span className="flex h-9 items-center rounded-md border bg-background/88 px-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-ring">
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
        />
        <span className="text-[0.68rem] font-semibold text-muted-foreground">{suffix}</span>
      </span>
    </label>
  );
}

function CompactCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={cn("min-h-0 min-w-0 overflow-hidden rounded-lg backdrop-blur", className)}>
      {children}
    </Card>
  );
}

export function BmiCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [theme, setTheme] = useState<ThemeName>("day");
  const [metric, setMetric] = useState(DEFAULT_METRIC);
  const [imperial, setImperial] = useState(DEFAULT_IMPERIAL);
  const [savedResults, setSavedResults] = useState<SavedResult[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved) as SavedResult[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedResults));
  }, [savedResults]);

  const currentTheme = THEMES[theme];

  const values = useMemo(() => {
    if (unit === "metric") {
      const weightKg = parsePositiveNumber(metric.weightKg);
      const heightCm = parsePositiveNumber(metric.heightCm);

      if (!weightKg || !heightCm) {
        return null;
      }

      const heightMeters = heightCm / 100;
      return {
        bmi: roundToOne(weightKg / heightMeters ** 2),
        heightMeters,
        weightLabel: `${weightKg} kg`,
        heightLabel: `${heightCm} cm`,
      };
    }

    const weightLb = parsePositiveNumber(imperial.weightLb);
    const heightFt = parsePositiveNumber(imperial.heightFt);
    const heightIn = parsePositiveNumber(imperial.heightIn) ?? 0;
    const totalInches = heightFt ? heightFt * 12 + heightIn : 0;

    if (!weightLb || totalInches <= 0) {
      return null;
    }

    const heightMeters = totalInches * 0.0254;

    return {
      bmi: roundToOne((weightLb / totalInches ** 2) * 703),
      heightMeters,
      weightLabel: `${weightLb} lb`,
      heightLabel: `${heightFt} ft ${heightIn} in`,
    };
  }, [imperial, metric, unit]);

  const category = values ? getCategory(values.bmi) : null;
  const healthyRange = values
    ? {
        min: Math.round(18.5 * values.heightMeters ** 2),
        max: Math.round(24.9 * values.heightMeters ** 2),
      }
    : null;

  const resultText =
    values && category
      ? `BMI ${values.bmi} (${category.label}) for ${values.weightLabel} and ${values.heightLabel}.`
      : "";

  function validate(showSuccess = true) {
    if (!values) {
      toast.error("Enter a valid height and weight first.");
      setHasCalculated(false);
      return false;
    }

    setHasCalculated(true);

    if (showSuccess) {
      toast.success("BMI calculated.");
    }

    return true;
  }

  function saveResult() {
    if (!validate(false) || !values || !category) {
      return;
    }

    const isDuplicate = savedResults.some(
      (result) =>
        result.bmi === values.bmi &&
        result.category === category.label &&
        result.unit === unit &&
        result.weightLabel === values.weightLabel &&
        result.heightLabel === values.heightLabel,
    );

    if (isDuplicate) {
      toast.info("This result is already saved.");
      return;
    }

    const nextResult: SavedResult = {
      id: crypto.randomUUID(),
      bmi: values.bmi,
      category: category.label,
      unit,
      weightLabel: values.weightLabel,
      heightLabel: values.heightLabel,
      createdAt: new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSavedResults((current) => [nextResult, ...current].slice(0, 4));
    toast.success("Result saved to history.");
  }

  async function copyResult() {
    if (!validate(false) || !resultText) {
      return;
    }

    await navigator.clipboard.writeText(resultText);
    toast.success("BMI result copied.");
  }

  function resetCalculator() {
    setMetric(DEFAULT_METRIC);
    setImperial(DEFAULT_IMPERIAL);
    setUnit("metric");
    setHasCalculated(false);
    toast.info("Calculator reset.");
  }

  function clearHistory() {
    setSavedResults([]);
    toast.info("History cleared.");
  }

  return (
    <main className={cn("fixed inset-0 h-dvh w-dvw overflow-hidden p-2 sm:p-3", currentTheme.shell)}>
      <div className="mx-auto grid h-full min-w-0 max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-2">
        <header className="flex min-h-0 min-w-0 items-center justify-between gap-2 overflow-hidden rounded-lg border border-white/25 bg-white/18 px-3 py-2 backdrop-blur">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge className={cn("gap-1 border-transparent", currentTheme.accent)}>
                <Activity className="h-3.5 w-3.5" />
                BMI
              </Badge>
              <h1 className="truncate text-lg font-bold sm:text-2xl">BMI Calculator</h1>
            </div>
            <p className={cn("truncate text-xs sm:text-sm", currentTheme.text)}>
              Calculate, classify, save, and switch themes without leaving the screen.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {Object.entries(THEMES).map(([name, item]) => {
              const Icon = item.icon;
              return (
                <Button
                  key={name}
                  type="button"
                  variant={theme === name ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme(name as ThemeName)}
                  aria-label={`Use ${item.label} theme`}
                  className={cn("h-9 w-9", theme === name ? currentTheme.accent : "bg-white/70")}
                >
                  <Icon />
                </Button>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={resetCalculator}
              aria-label="Reset calculator"
              className="h-9 w-9 bg-white/70"
            >
              <RotateCcw />
            </Button>
          </div>
        </header>

        <section className="grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] gap-2 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)_minmax(0,0.84fr)]">
          <CompactCard className={currentTheme.panel}>
            <CardHeader className="space-y-1 p-3 pb-2 sm:p-4 sm:pb-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Scale className="h-4 w-4 text-primary" />
                Inputs
              </CardTitle>
              <CardDescription className={cn("text-xs", theme === "night" && "text-slate-300")}>
                Metric or imperial values.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3 pt-0 sm:p-4 sm:pt-0">
              <div className="grid grid-cols-2 gap-2">
                {(["metric", "imperial"] as UnitSystem[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={unit === item}
                    onClick={() => setUnit(item)}
                    className={cn(
                      "h-10 rounded-md border text-sm font-bold capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      unit === item ? currentTheme.accent : "bg-white/60 text-slate-800 hover:bg-white/80",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {unit === "metric" ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <Field
                    id="weight-kg"
                    label="Weight"
                    value={metric.weightKg}
                    suffix="kg"
                    onChange={(weightKg) => setMetric((current) => ({ ...current, weightKg }))}
                  />
                  <Field
                    id="height-cm"
                    label="Height"
                    value={metric.heightCm}
                    suffix="cm"
                    onChange={(heightCm) => setMetric((current) => ({ ...current, heightCm }))}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 lg:grid-cols-1 xl:grid-cols-3">
                  <Field
                    id="weight-lb"
                    label="Weight"
                    value={imperial.weightLb}
                    suffix="lb"
                    onChange={(weightLb) => setImperial((current) => ({ ...current, weightLb }))}
                  />
                  <Field
                    id="height-ft"
                    label="Height"
                    value={imperial.heightFt}
                    suffix="ft"
                    onChange={(heightFt) => setImperial((current) => ({ ...current, heightFt }))}
                  />
                  <Field
                    id="height-in"
                    label="Inches"
                    value={imperial.heightIn}
                    suffix="in"
                    onChange={(heightIn) => setImperial((current) => ({ ...current, heightIn }))}
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  onClick={() => validate()}
                  className={currentTheme.accent}
                  aria-label="Calculate BMI"
                >
                  <Scale />
                  <span className="hidden sm:inline lg:hidden xl:inline">Calc</span>
                </Button>
                <Button type="button" variant="secondary" onClick={saveResult} aria-label="Save BMI result">
                  <Save />
                  <span className="hidden sm:inline lg:hidden xl:inline">Save</span>
                </Button>
                <Button type="button" variant="outline" onClick={copyResult} aria-label="Copy BMI result">
                  <Clipboard />
                  <span className="hidden sm:inline lg:hidden xl:inline">Copy</span>
                </Button>
              </div>

              <div className="rounded-lg border bg-white/55 p-2.5 text-xs text-slate-700">
                BMI is a screening tool for adults, not a diagnosis.
              </div>
            </CardContent>
          </CompactCard>

          <CompactCard className={currentTheme.panel}>
            <CardContent className="flex h-full min-h-0 flex-col justify-between gap-3 p-3 sm:p-4">
              {values && category ? (
                <>
                  <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className={cn("text-xs font-bold uppercase", currentTheme.text)}>Your BMI</p>
                      <p className="text-5xl font-black tracking-normal sm:text-6xl">{values.bmi}</p>
                      <p className={cn("mt-1 text-sm font-semibold", category.textColor)}>
                        {category.label} · {category.description}
                      </p>
                    </div>
                    <Badge className={cn("border-transparent text-white", category.color)}>
                      {category.range}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="relative h-4 overflow-hidden rounded-full bg-white/70">
                      <div className="absolute inset-y-0 left-0 w-1/4 bg-sky-500" />
                      <div className="absolute inset-y-0 left-1/4 w-1/4 bg-emerald-600" />
                      <div className="absolute inset-y-0 left-1/2 w-1/4 bg-amber-500" />
                      <div className="absolute inset-y-0 left-3/4 w-1/4 bg-rose-600" />
                      <span
                        className="absolute top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-slate-950 shadow"
                        style={{ left: getBmiPosition(values.bmi) }}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[0.65rem] font-semibold">
                      {CATEGORIES.map((item) => (
                        <span key={item.label} className="truncate">
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border bg-white/50 p-2.5">
                      <p className={cn("text-[0.68rem] font-bold uppercase", currentTheme.text)}>
                        Healthy range
                      </p>
                      <p className="text-sm font-bold">
                        {healthyRange?.min} - {healthyRange?.max} kg
                      </p>
                    </div>
                    <div className="rounded-lg border bg-white/50 p-2.5">
                      <p className={cn("text-[0.68rem] font-bold uppercase", currentTheme.text)}>
                        Inputs
                      </p>
                      <p className="truncate text-sm font-bold">
                        {values.weightLabel}, {values.heightLabel}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed bg-white/40 p-4 text-center">
                  <Scale className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="text-lg font-bold">Enter valid measurements</p>
                  <p className={cn("mt-1 max-w-xs text-sm", currentTheme.text)}>
                    Your BMI result, scale position, and healthy range appear here.
                  </p>
                  {hasCalculated ? (
                    <Badge variant="outline" className="mt-3 border-destructive text-destructive">
                      Check inputs
                    </Badge>
                  ) : null}
                </div>
              )}
            </CardContent>
          </CompactCard>

          <div className="grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)]">
            <CompactCard className={currentTheme.panel}>
              <CardHeader className="flex-row items-center justify-between space-y-0 p-3 pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <History className="h-4 w-4 text-primary" />
                    History
                  </CardTitle>
                  <CardDescription className={cn("text-xs", theme === "night" && "text-slate-300")}>
                    No duplicates saved.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white/70"
                  onClick={clearHistory}
                  aria-label="Clear history"
                  disabled={savedResults.length === 0}
                >
                  <Trash2 />
                </Button>
              </CardHeader>
              <CardContent className="grid min-h-0 gap-1.5 p-3 pt-0">
                {savedResults.length > 0 ? (
                  savedResults.map((result) => (
                    <div
                      key={result.id}
                      className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border bg-white/50 px-2.5 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold">
                          BMI {result.bmi} - {result.category}
                        </p>
                        <p className={cn("truncate text-[0.68rem]", currentTheme.text)}>
                          {result.weightLabel}, {result.heightLabel}
                        </p>
                      </div>
                      <Badge variant="muted" className="capitalize">
                        {result.unit}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md border border-dashed bg-white/45 p-3 text-xs text-muted-foreground">
                    Save a result once. Repeated matches are ignored.
                  </div>
                )}
              </CardContent>
            </CompactCard>

            <CompactCard className={currentTheme.panel}>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-base">Guide</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-1.5 p-3 pt-0">
                {CATEGORIES.map((item) => (
                  <div key={item.label} className="rounded-md border bg-white/50 p-2">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                      <p className="truncate text-xs font-bold">{item.label}</p>
                    </div>
                    <p className={cn("text-[0.65rem]", currentTheme.text)}>{item.range}</p>
                  </div>
                ))}
              </CardContent>
            </CompactCard>
          </div>
        </section>
      </div>
    </main>
  );
}
