"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
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

type CharacterSet = "uppercase" | "lowercase" | "numbers" | "symbols";
type Mode = "simple" | "advanced";

type GeneratorSettings = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  requireEachSelected: boolean;
  avoidRepeats: boolean;
};

const DEFAULT_SETTINGS: GeneratorSettings = {
  length: 18,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: true,
  requireEachSelected: true,
  avoidRepeats: false,
};

const CHARACTER_SETS: Record<CharacterSet, { label: string; value: string; sample: string }> = {
  uppercase: {
    label: "Uppercase",
    value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    sample: "A-Z",
  },
  lowercase: {
    label: "Lowercase",
    value: "abcdefghijklmnopqrstuvwxyz",
    sample: "a-z",
  },
  numbers: {
    label: "Numbers",
    value: "0123456789",
    sample: "0-9",
  },
  symbols: {
    label: "Symbols",
    value: "!@#$%^&*()-_=+[]{};:,.?/|~",
    sample: "!@#",
  },
};

const AMBIGUOUS_CHARACTERS = new Set("0O1lI|`'\"{}[]()<>;:,.");
const SET_KEYS = Object.keys(CHARACTER_SETS) as CharacterSet[];

function randomIndex(max: number) {
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);
  return randomValues[0] % max;
}

function shuffleCharacters(characters: string[]) {
  const shuffled = [...characters];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.join("");
}

function filterAmbiguous(value: string) {
  return [...value].filter((character) => !AMBIGUOUS_CHARACTERS.has(character)).join("");
}

function getActivePools(settings: GeneratorSettings) {
  return SET_KEYS.filter((key) => settings[key]).map((key) => {
    const characterSet = CHARACTER_SETS[key].value;

    return {
      key,
      value: settings.excludeAmbiguous ? filterAmbiguous(characterSet) : characterSet,
    };
  }).filter((pool) => pool.value.length > 0);
}

function generatePassword(settings: GeneratorSettings) {
  const activePools = getActivePools(settings);

  if (activePools.length === 0) {
    return "";
  }

  const allCharacters = activePools.map((pool) => pool.value).join("");
  const passwordCharacters: string[] = [];
  const usedCharacters = new Set<string>();

  if (settings.requireEachSelected) {
    activePools.forEach((pool) => {
      const character = pool.value[randomIndex(pool.value.length)];
      passwordCharacters.push(character);
      usedCharacters.add(character);
    });
  }

  while (passwordCharacters.length < settings.length) {
    const character = allCharacters[randomIndex(allCharacters.length)];

    if (
      settings.avoidRepeats &&
      usedCharacters.has(character) &&
      usedCharacters.size < allCharacters.length
    ) {
      continue;
    }

    passwordCharacters.push(character);
    usedCharacters.add(character);
  }

  return shuffleCharacters(passwordCharacters.slice(0, settings.length));
}

function calculateEntropy(settings: GeneratorSettings) {
  const poolSize = getActivePools(settings).reduce(
    (total, pool) => total + pool.value.length,
    0,
  );

  if (poolSize === 0) {
    return 0;
  }

  return Math.round(settings.length * Math.log2(poolSize));
}

function canGeneratePassword(settings: GeneratorSettings) {
  const activePools = getActivePools(settings);

  return activePools.length > 0 && settings.length >= activePools.length;
}

function getStrength(entropy: number) {
  if (entropy >= 120) {
    return {
      label: "Excellent",
      className: "w-full bg-emerald-600",
      description: "Ready for highly sensitive accounts",
    };
  }

  if (entropy >= 80) {
    return {
      label: "Strong",
      className: "w-3/4 bg-primary",
      description: "Solid for everyday password manager use",
    };
  }

  if (entropy >= 55) {
    return {
      label: "Fair",
      className: "w-1/2 bg-amber-500",
      description: "Usable, but longer is better",
    };
  }

  return {
    label: "Weak",
    className: "w-1/4 bg-destructive",
    description: "Increase length or add character types",
  };
}

function OptionToggle({
  checked,
  label,
  detail,
  onChange,
  disabled,
  tabIndex,
}: {
  checked: boolean;
  label: string;
  detail: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  tabIndex?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex min-h-[3.875rem] w-full items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "border-primary bg-accent/70" : "hover:bg-muted/60",
      )}
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{detail}</span>
      </span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
          checked ? "border-primary bg-primary text-primary-foreground" : "bg-background",
        )}
      >
        {checked ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
    </button>
  );
}

export function PasswordGenerator() {
  const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_SETTINGS);
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [mode, setMode] = useState<Mode>("simple");

  const entropy = useMemo(() => calculateEntropy(settings), [settings]);
  const strength = getStrength(entropy);
  const activePools = getActivePools(settings);
  const canGenerate = canGeneratePassword(settings);
  const selectedSetSummary = SET_KEYS.filter((key) => settings[key])
    .map((key) => CHARACTER_SETS[key].sample)
    .join("  ");

  const applySettings = (nextSettings: GeneratorSettings, regenerate = password.length > 0) => {
    setSettings(nextSettings);

    if (regenerate && canGeneratePassword(nextSettings)) {
      setPassword(generatePassword(nextSettings));
    }
  };

  const updateSetting = <Key extends keyof GeneratorSettings>(
    key: Key,
    value: GeneratorSettings[Key],
  ) => {
    applySettings({ ...settings, [key]: value });
  };

  const handleCharacterSetChange = (key: CharacterSet, checked: boolean) => {
    const enabledCount = SET_KEYS.filter((setKey) => settings[setKey]).length;

    if (!checked && enabledCount === 1) {
      toast.error("Keep at least one character type enabled.");
      return;
    }

    updateSetting(key, checked);
  };

  const handleGenerate = () => {
    if (!canGenerate) {
      toast.error("Length must fit the required character sets.");
      return;
    }

    setPassword(generatePassword(settings));
  };

  const handleCopy = async () => {
    if (!password) {
      return;
    }

    await navigator.clipboard.writeText(password);
    toast.success("Password copied.");
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <header className="rounded-lg border bg-card shadow-sm">
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center lg:py-3">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="w-fit gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Client-side crypto
                </Badge>
                <Badge variant="outline" className="w-fit">
                  {mode === "advanced" ? "Advanced workspace" : "Beginner workspace"}
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                Password Generator
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-5 text-muted-foreground">
                Create memorable, strict, or high-entropy passwords without sending
                generation logic to a server.
              </p>
            </div>
            <div className="grid grid-cols-2 rounded-lg border bg-muted p-1 md:w-64">
              <Button
                type="button"
                variant={mode === "simple" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("simple")}
                className="shadow-none"
                aria-pressed={mode === "simple"}
              >
                Beginner
              </Button>
              <Button
                type="button"
                variant={mode === "advanced" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("advanced")}
                className="shadow-none"
                aria-pressed={mode === "advanced"}
              >
                Advanced
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(430px,500px)_1fr] lg:items-start">
          <Card
            className={cn(
              "order-2 overflow-hidden transition-colors duration-300 lg:order-1",
              mode === "advanced" && "border-primary/40",
            )}
          >
            <CardHeader className="p-5 lg:p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Settings Panel</CardTitle>
                  <CardDescription>
                    Choose length, character types, and generation rules.
                  </CardDescription>
                </div>
                <Badge variant={mode === "advanced" ? "default" : "muted"}>
                  {mode === "advanced" ? "Full" : "Core"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-0 lg:p-4 lg:pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="length" className="text-sm font-medium">
                    Password length
                  </label>
                  <output
                    htmlFor="length"
                    className="rounded-md bg-primary px-2.5 py-1 text-sm font-semibold text-primary-foreground"
                  >
                    {settings.length}
                  </output>
                </div>
                <input
                  id="length"
                  type="range"
                  min={8}
                  max={64}
                  value={settings.length}
                  onChange={(event) => updateSetting("length", Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>8</span>
                  <span>64</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {SET_KEYS.map((key) => (
                  <OptionToggle
                    key={key}
                    checked={settings[key]}
                    label={CHARACTER_SETS[key].label}
                    detail={CHARACTER_SETS[key].sample}
                    onChange={(checked) => handleCharacterSetChange(key, checked)}
                  />
                ))}
              </div>

              <div
                aria-hidden={mode !== "advanced"}
                className={cn(
                  "overflow-hidden border-t transition-[max-height,opacity,padding,transform,border-color] duration-500 ease-out motion-reduce:transition-none",
                  mode === "advanced"
                    ? "max-h-80 border-border pt-4 opacity-100 translate-y-0"
                    : "pointer-events-none max-h-0 border-transparent pt-0 opacity-0 -translate-y-2",
                )}
              >
                <div className="grid gap-3 lg:grid-cols-3">
                  <OptionToggle
                    checked={settings.excludeAmbiguous}
                    label="Exclude ambiguous"
                    detail="Removes easy-to-confuse characters"
                    onChange={(checked) => updateSetting("excludeAmbiguous", checked)}
                    tabIndex={mode === "advanced" ? undefined : -1}
                  />
                  <OptionToggle
                    checked={settings.requireEachSelected}
                    label="Require each selected set"
                    detail="Ensures every enabled group appears"
                    onChange={(checked) => updateSetting("requireEachSelected", checked)}
                    tabIndex={mode === "advanced" ? undefined : -1}
                  />
                  <OptionToggle
                    checked={settings.avoidRepeats}
                    label="Avoid repeated characters"
                    detail="Uses unique characters when possible"
                    onChange={(checked) => updateSetting("avoidRepeats", checked)}
                    tabIndex={mode === "advanced" ? undefined : -1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="order-1 grid gap-4 lg:order-2">
            <Card className="overflow-hidden border-primary/20">
              <CardHeader className="p-5 lg:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-xl">Password Preview</CardTitle>
                    <CardDescription>Review strength before copying.</CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {entropy} bits entropy
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0 lg:p-4 lg:pt-0">
                <div className="rounded-lg border bg-accent/45 p-4">
                  <div className="flex min-h-24 items-center break-all font-mono text-xl font-semibold leading-relaxed sm:text-2xl lg:min-h-16 lg:text-2xl">
                    {password
                      ? isVisible
                        ? password
                        : "*".repeat(password.length)
                      : "Select options to generate"}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
                  <Button type="button" onClick={handleGenerate} disabled={!canGenerate}>
                    <RefreshCw />
                    Generate
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCopy} disabled={!password}>
                    <Clipboard />
                    Copy
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsVisible((visible) => !visible)}>
                    {isVisible ? <EyeOff /> : <Eye />}
                    {isVisible ? "Hide" : "Show"}
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border bg-card px-3 py-2">
                    <p className="text-xs text-muted-foreground">Length</p>
                    <p className="text-lg font-semibold">{settings.length}</p>
                  </div>
                  <div className="rounded-lg border bg-card px-3 py-2">
                    <p className="text-xs text-muted-foreground">Sets</p>
                    <p className="text-lg font-semibold">{activePools.length}</p>
                  </div>
                  <div className="rounded-lg border bg-card px-3 py-2">
                    <p className="text-xs text-muted-foreground">Mode</p>
                    <p className="text-lg font-semibold capitalize">{mode}</p>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{strength.label}</p>
                      <p className="text-xs text-muted-foreground">{strength.description}</p>
                    </div>
                    <Badge variant="muted">{selectedSetSummary}</Badge>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full transition-all", strength.className)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80">
              <CardHeader className="p-5 lg:p-4">
                <CardTitle className="text-xl">Generation Controls</CardTitle>
                <CardDescription>
                  Use presets or reset back to a balanced default.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 p-5 pt-0 sm:grid-cols-2 lg:p-4 lg:pt-0 xl:grid-cols-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    applySettings({
                      ...DEFAULT_SETTINGS,
                      length: 16,
                      symbols: false,
                      excludeAmbiguous: true,
                    }, true)
                  }
                >
                  <KeyRound />
                  Memorable
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    applySettings({
                      ...DEFAULT_SETTINGS,
                      length: 24,
                      avoidRepeats: true,
                    }, true)
                  }
                >
                  <Sparkles />
                  Strict
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    applySettings({
                      ...DEFAULT_SETTINGS,
                      length: 32,
                      excludeAmbiguous: false,
                    }, true)
                  }
                >
                  <ShieldCheck />
                  Maximum
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    applySettings(DEFAULT_SETTINGS, true);
                    setMode("simple");
                  }}
                >
                  <RotateCcw />
                  Reset
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
