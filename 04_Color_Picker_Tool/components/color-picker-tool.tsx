"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clipboard,
  Download,
  Droplets,
  Eye,
  Palette,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
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

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

type HslColor = {
  h: number;
  s: number;
  l: number;
};

type PaletteMode = "complementary" | "analogous" | "triadic" | "tetradic" | "monochrome" | "shades";

const DEFAULT_HEX = "#16A3A3";
const DEFAULT_CONTRAST = "#111827";
const STORAGE_KEY = "color-picker-tool-saved-colors";

const PALETTE_MODES: { value: PaletteMode; label: string }[] = [
  { value: "complementary", label: "Complement" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "tetradic", label: "Tetradic" },
  { value: "monochrome", label: "Mono" },
  { value: "shades", label: "Shades" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHex(value: string) {
  const clean = value.trim().replace(/^#/, "");

  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return `#${clean
      .split("")
      .map((character) => character + character)
      .join("")
      .toUpperCase()}`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return `#${clean.toUpperCase()}`;
  }

  return null;
}

function hexToRgb(hex: string): RgbColor {
  const normalized = normalizeHex(hex) ?? DEFAULT_HEX;
  const value = normalized.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RgbColor) {
  return `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(lightness * 100) };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0);
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return {
    h: Math.round(hue * 60),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;

  if (saturation === 0) {
    const value = Math.round(lightness * 255);
    return { r: value, g: value, b: value };
  }

  const hueToRgb = (p: number, q: number, t: number) => {
    let nextT = t;
    if (nextT < 0) nextT += 1;
    if (nextT > 1) nextT -= 1;
    if (nextT < 1 / 6) return p + (q - p) * 6 * nextT;
    if (nextT < 1 / 2) return q;
    if (nextT < 2 / 3) return p + (q - p) * (2 / 3 - nextT) * 6;
    return p;
  };

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  return {
    r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hue) * 255),
    b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  };
}

function formatRgb({ r, g, b }: RgbColor) {
  return `rgb(${r}, ${g}, ${b})`;
}

function formatHsl({ h, s, l }: HslColor) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function shiftHue(hsl: HslColor, degrees: number, lightness = hsl.l) {
  return rgbToHex(
    hslToRgb({
      h: (hsl.h + degrees + 360) % 360,
      s: hsl.s,
      l: clamp(lightness, 8, 92),
    }),
  );
}

function createPalette(hex: string, mode: PaletteMode) {
  const hsl = rgbToHsl(hexToRgb(hex));

  if (mode === "complementary") {
    return [shiftHue(hsl, 0), shiftHue(hsl, 180), shiftHue(hsl, 180, hsl.l + 16), shiftHue(hsl, 0, hsl.l - 16)];
  }

  if (mode === "analogous") {
    return [-40, -20, 0, 20, 40].map((degree) => shiftHue(hsl, degree));
  }

  if (mode === "triadic") {
    return [0, 120, 240, 120].map((degree, index) =>
      shiftHue(hsl, degree, index === 3 ? hsl.l + 18 : hsl.l),
    );
  }

  if (mode === "tetradic") {
    return [0, 90, 180, 270].map((degree) => shiftHue(hsl, degree));
  }

  if (mode === "monochrome") {
    return [-24, -12, 0, 12, 24].map((offset) => shiftHue(hsl, 0, hsl.l + offset));
  }

  return [14, 28, 42, 56, 70, 84].map((lightness) => shiftHue(hsl, 0, lightness));
}

function getRelativeLuminance({ r, g, b }: RgbColor) {
  const [red, green, blue] = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getContrastRatio(firstHex: string, secondHex: string) {
  const first = getRelativeLuminance(hexToRgb(firstHex));
  const second = getRelativeLuminance(hexToRgb(secondHex));
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastLabel(ratio: number) {
  if (ratio >= 7) {
    return { label: "AAA", detail: "Excellent for normal text", className: "bg-emerald-600" };
  }

  if (ratio >= 4.5) {
    return { label: "AA", detail: "Good for normal text", className: "bg-primary" };
  }

  if (ratio >= 3) {
    return { label: "Large", detail: "Use only for large text", className: "bg-amber-500" };
  }

  return { label: "Fail", detail: "Choose stronger contrast", className: "bg-destructive" };
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border bg-background px-3 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}

function ColorCopyButton({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (value: string, label: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value, label)}
      className="group flex min-h-16 items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 text-left transition hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="min-w-0">
        <span className="block text-xs font-medium text-muted-foreground">{label}</span>
        <span className="block truncate font-mono text-sm font-semibold">{value}</span>
      </span>
      <Clipboard className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
    </button>
  );
}

export function ColorPickerTool() {
  const [hex, setHex] = useState(DEFAULT_HEX);
  const [hexInput, setHexInput] = useState(DEFAULT_HEX);
  const [rgbInput, setRgbInput] = useState(formatRgb(hexToRgb(DEFAULT_HEX)));
  const [hslInput, setHslInput] = useState(formatHsl(rgbToHsl(hexToRgb(DEFAULT_HEX))));
  const [contrastHex, setContrastHex] = useState(DEFAULT_CONTRAST);
  const [paletteMode, setPaletteMode] = useState<PaletteMode>("analogous");
  const [savedColors, setSavedColors] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedColors = window.localStorage.getItem(STORAGE_KEY);

    if (!storedColors) {
      return [];
    }

    try {
      const parsedColors = JSON.parse(storedColors) as string[];
      return parsedColors.filter((color) => normalizeHex(color));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const palette = useMemo(() => createPalette(hex, paletteMode), [hex, paletteMode]);
  const contrastRatio = useMemo(() => getContrastRatio(hex, contrastHex), [hex, contrastHex]);
  const contrast = getContrastLabel(contrastRatio);
  const cssVariable = `--brand-color: ${hex};`;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedColors));
  }, [savedColors]);

  const syncFromHex = (nextHex: string) => {
    const normalized = normalizeHex(nextHex);

    if (!normalized) {
      toast.error("Enter a valid 3 or 6 digit HEX color.");
      return;
    }

    const nextRgb = hexToRgb(normalized);
    const nextHsl = rgbToHsl(nextRgb);
    setHex(normalized);
    setHexInput(normalized);
    setRgbInput(formatRgb(nextRgb));
    setHslInput(formatHsl(nextHsl));
  };

  const handleHexInput = (value: string) => {
    setHexInput(value);
    const normalized = normalizeHex(value);

    if (normalized) {
      syncFromHex(normalized);
    }
  };

  const handleRgbInput = (value: string) => {
    setRgbInput(value);
    const matches = value.match(/\d+(\.\d+)?/g);

    if (!matches || matches.length < 3) {
      return;
    }

    const [r, g, b] = matches.slice(0, 3).map((entry) => clamp(Number(entry), 0, 255));
    syncFromHex(rgbToHex({ r, g, b }));
  };

  const handleHslInput = (value: string) => {
    setHslInput(value);
    const matches = value.match(/\d+(\.\d+)?/g);

    if (!matches || matches.length < 3) {
      return;
    }

    const [h, s, l] = matches.slice(0, 3).map(Number);
    syncFromHex(rgbToHex(hslToRgb({ h, s, l })));
  };

  const copyValue = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied.`);
  };

  const handleSave = () => {
    if (savedColors.includes(hex)) {
      toast.info("This color is already saved.");
      return;
    }

    setSavedColors([hex, ...savedColors].slice(0, 12));
    toast.success("Color saved.");
  };

  const removeSavedColor = (color: string) => {
    setSavedColors(savedColors.filter((savedColor) => savedColor !== color));
    toast.success("Saved color removed.");
  };

  const clearSavedColors = () => {
    if (savedColors.length === 0) {
      toast.info("No saved colors to clear.");
      return;
    }

    setSavedColors([]);
    toast.success("Saved colors cleared.");
  };

  const randomizeColor = () => {
    const nextColor = rgbToHex({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    });
    syncFromHex(nextColor);
    toast.success("Random color generated.");
  };

  const resetWorkspace = () => {
    syncFromHex(DEFAULT_HEX);
    setContrastHex(DEFAULT_CONTRAST);
    setPaletteMode("analogous");
    toast.success("Workspace reset.");
  };

  const copyPalette = async () => {
    await navigator.clipboard.writeText(palette.join(", "));
    toast.success("Palette copied.");
  };

  const exportPalette = async () => {
    const css = palette.map((color, index) => `--palette-${index + 1}: ${color};`).join("\n");
    await navigator.clipboard.writeText(css);
    toast.success("CSS palette export copied.");
  };

  const updateContrast = (value: string) => {
    const normalized = normalizeHex(value);

    if (!normalized) {
      toast.error("Use a valid HEX color for contrast.");
      return;
    }

    setContrastHex(normalized);
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <header className="rounded-lg border bg-card shadow-sm">
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Droplets className="h-3.5 w-3.5" />
                  Live color workspace
                </Badge>
                <Badge variant="outline">{paletteMode}</Badge>
              </div>
              <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                Color Picker Tool
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-5 text-muted-foreground">
                Pick, convert, compare, and save production-ready colors in one responsive
                workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button type="button" variant="outline" onClick={randomizeColor}>
                <Sparkles />
                Random
              </Button>
              <Button type="button" variant="outline" onClick={resetWorkspace}>
                <RotateCcw />
                Reset
              </Button>
              <Button type="button" onClick={handleSave}>
                <Save />
                Save
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(340px,430px)_1fr]">
          <Card className="overflow-hidden">
            <CardHeader className="p-5 lg:p-4">
              <CardTitle className="text-xl">Picker</CardTitle>
              <CardDescription>Use the swatch, native picker, or format inputs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-0 lg:p-4 lg:pt-0">
              <div className="checkerboard overflow-hidden rounded-lg border">
                <div
                  className="flex min-h-56 flex-col justify-between p-4 text-white"
                  style={{ backgroundColor: hex }}
                >
                  <div className="flex justify-between gap-3">
                    <Badge variant="secondary">Current</Badge>
                    <span className="rounded-md bg-black/35 px-2.5 py-1 font-mono text-sm">
                      {hex}
                    </span>
                  </div>
                  <div>
                    <p className="max-w-xs text-3xl font-semibold tracking-normal">
                      Sample Text
                    </p>
                    <p className="mt-1 text-sm text-white/85">
                      Preview the color as a UI surface before copying it.
                    </p>
                  </div>
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium">Native color picker</span>
                <input
                  type="color"
                  value={hex}
                  onChange={(event) => syncFromHex(event.target.value)}
                  className="h-12 w-full cursor-pointer rounded-md border bg-background p-1"
                  aria-label="Choose color"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <Field label="HEX" value={hexInput} onChange={handleHexInput} />
                <Field label="RGB" value={rgbInput} onChange={handleRgbInput} />
                <Field label="HSL" value={hslInput} onChange={handleHslInput} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ColorCopyButton label="HEX" value={hex} onCopy={copyValue} />
                <ColorCopyButton label="RGB" value={formatRgb(rgb)} onCopy={copyValue} />
                <ColorCopyButton label="HSL" value={formatHsl(hsl)} onCopy={copyValue} />
                <ColorCopyButton label="CSS variable" value={cssVariable} onCopy={copyValue} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="p-5 lg:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-xl">Palette Generator</CardTitle>
                    <CardDescription>Switch harmony modes and copy the result.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={copyPalette}>
                      <Clipboard />
                      Copy
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={exportPalette}>
                      <Download />
                      CSS
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0 lg:p-4 lg:pt-0">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                  {PALETTE_MODES.map((mode) => (
                    <Button
                      key={mode.value}
                      type="button"
                      variant={paletteMode === mode.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setPaletteMode(mode.value);
                        toast.success(`${mode.label} palette generated.`);
                      }}
                      aria-pressed={paletteMode === mode.value}
                    >
                      {mode.label}
                    </Button>
                  ))}
                </div>

                <div className="grid min-h-40 overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  {palette.map((color, index) => (
                    <button
                      key={`${color}-${index}`}
                      type="button"
                      onClick={() => {
                        syncFromHex(color);
                        toast.success("Palette color selected.");
                      }}
                      className="group flex min-h-24 flex-col justify-end p-3 text-left text-white transition-transform hover:scale-[1.02] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      style={{ backgroundColor: color }}
                    >
                      <span className="w-fit rounded-md bg-black/35 px-2 py-1 font-mono text-xs font-semibold">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card>
                <CardHeader className="p-5 lg:p-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Eye className="h-5 w-5" />
                    Contrast Check
                  </CardTitle>
                  <CardDescription>Compare selected color with a text or background color.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5 pt-0 lg:p-4 lg:pt-0">
                  <div
                    className="rounded-lg border p-4"
                    style={{ backgroundColor: hex, color: contrastHex }}
                  >
                    <p className="text-2xl font-semibold tracking-normal">Readable UI text</p>
                    <p className="mt-1 text-sm">
                      Ratio {contrastRatio.toFixed(2)}:1 against {contrastHex}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <Field label="Compare with HEX" value={contrastHex} onChange={setContrastHex} />
                    <Button
                      type="button"
                      variant="outline"
                      className="self-end"
                      onClick={() => updateContrast(contrastHex)}
                    >
                      Check
                    </Button>
                  </div>
                  <div className="space-y-2 rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{contrast.label} contrast</p>
                        <p className="text-xs text-muted-foreground">{contrast.detail}</p>
                      </div>
                      <Badge variant="muted">{contrastRatio.toFixed(2)}:1</Badge>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all", contrast.className)}
                        style={{ width: `${clamp((contrastRatio / 7) * 100, 12, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-5 lg:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Palette className="h-5 w-5" />
                        Saved Colors
                      </CardTitle>
                      <CardDescription>Stored locally in this browser.</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={clearSavedColors}>
                      <Trash2 />
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 lg:p-4 lg:pt-0">
                  {savedColors.length === 0 ? (
                    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-3 text-sm font-medium">No saved colors yet</p>
                      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                        Save a useful color and it will appear here for quick reuse.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {savedColors.map((color) => (
                        <div key={color} className="overflow-hidden rounded-lg border bg-card">
                          <button
                            type="button"
                            onClick={() => syncFromHex(color)}
                            className="h-20 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            style={{ backgroundColor: color }}
                            aria-label={`Select saved color ${color}`}
                          />
                          <div className="flex items-center justify-between gap-2 p-2">
                            <button
                              type="button"
                              className="font-mono text-sm font-semibold"
                              onClick={() => copyValue(color, "Saved color")}
                            >
                              {color}
                            </button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSavedColor(color)}
                              aria-label={`Remove ${color}`}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/85">
              <CardContent className="grid gap-3 p-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Red</p>
                  <p className="text-lg font-semibold">{rgb.r}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Green</p>
                  <p className="text-lg font-semibold">{rgb.g}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blue</p>
                  <p className="text-lg font-semibold">{rgb.b}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hue</p>
                  <p className="text-lg font-semibold">{hsl.h} deg</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
