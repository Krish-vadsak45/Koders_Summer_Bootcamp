"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  ChevronLeft,
  Copy,
  Download,
  Heart,
  History,
  Info,
  Loader2,
  Moon,
  RefreshCw,
  Search,
  Share2,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocalQuotes } from "@/lib/local-quotes";
import type { Quote } from "@/lib/quotes";
import { cn } from "@/lib/utils";

type QuoteResponse = {
  quote: Quote;
  source: "api" | "fallback";
  provider: string;
  message?: string;
};

type StoredQuote = Quote & {
  provider: string;
};

const categories = ["all", "motivation", "love", "success", "life", "study", "coding"] as const;
const favoritesKey = "quote-generator:favorites";
const historyKey = "quote-generator:history";
const themeKey = "quote-generator:theme";

export function QuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [provider, setProvider] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [showAuthor, setShowAuthor] = useState(false);
  const [history, setHistory] = useState<StoredQuote[]>([]);
  const [favorites, setFavorites] = useState<StoredQuote[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hasHydrated, setHasHydrated] = useState(false);
  const hasLoadedInitialQuote = useRef(false);

  const quoteText = useMemo(() => {
    if (!quote) {
      return "";
    }

    return `"${quote.text}" - ${quote.author}`;
  }, [quote]);

  const favoriteId = quote ? getQuoteId(quote) : "";
  const isFavorite = favorites.some((favorite) => getQuoteId(favorite) === favoriteId);

  const applyQuote = useCallback((nextQuote: Quote, nextProvider: string) => {
    setQuote(nextQuote);
    setProvider(nextProvider);
    setCopied(false);
    setShowAuthor(false);
    setHistory((currentHistory) => limitStoredQuotes([
      { ...nextQuote, provider: nextProvider },
      ...currentHistory.filter((item) => getQuoteId(item) !== getQuoteId(nextQuote)),
    ]));
  }, []);

  const getFilteredLocalQuote = useCallback(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matches = getLocalQuotes().filter((item) => {
      const categoryMatch =
        selectedCategory === "all" || inferCategory(item) === selectedCategory;
      const searchMatch =
        !normalizedSearch ||
        item.text.toLowerCase().includes(normalizedSearch) ||
        item.author.toLowerCase().includes(normalizedSearch);

      return categoryMatch && searchMatch;
    });

    if (!matches.length) {
      return null;
    }

    return matches[Math.floor(Math.random() * matches.length)];
  }, [searchTerm, selectedCategory]);

  const fetchQuote = useCallback(async (isInitialLoad = false) => {
    if (!hasHydrated) {
      return;
    }

    if (!isInitialLoad) {
      setIsLoading(true);
    }

    const filteredQuote = getFilteredLocalQuote();

    if (filteredQuote && (selectedCategory !== "all" || searchTerm.trim())) {
      applyQuote(filteredQuote, "Filtered quote found");
      toast.success("Filtered quote found", {
        description: "Showing a matching local quote.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(buildQuoteApiUrl(quote, history));

      if (!response.ok) {
        throw new Error("Unable to fetch quote.");
      }

      const data = (await response.json()) as QuoteResponse;
      applyQuote(data.quote, data.provider);

      if (data.source === "fallback") {
        toast.warning("Using local fallback", {
          description: data.message || "Showing a fallback quote right now.",
        });
      } else if (!isInitialLoad) {
        toast.success("New quote loaded", {
          description: `Source: ${data.provider}`,
        });
      }
    } catch {
      const fallbackQuote = getFilteredLocalQuote() || getRandomQuote(getLocalQuotes());
      applyQuote(fallbackQuote, "Local fallback");
      toast.error("Live APIs unavailable", {
        description: "A local fallback quote is shown.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [applyQuote, getFilteredLocalQuote, hasHydrated, history, quote, searchTerm, selectedCategory]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFavorites(readStoredQuotes(favoritesKey));
      setHistory(readStoredQuotes(historyKey));
      setTheme(readTheme());
      setHasHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasHydrated || hasLoadedInitialQuote.current) {
      return undefined;
    }

    hasLoadedInitialQuote.current = true;
    const timeoutId = window.setTimeout(() => {
      void fetchQuote(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchQuote, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(themeKey, theme);
  }, [hasHydrated, theme]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }, [favorites, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(historyKey, JSON.stringify(history));
  }, [hasHydrated, history]);

  async function copyQuote() {
    if (!quoteText) {
      return;
    }

    try {
      await copyTextToClipboard(quoteText);
      setCopied(true);
      toast.success("Quote copied", {
        description: "The quote is ready to paste.",
      });
    } catch {
      toast.error("Copy failed", {
        description: "Your browser blocked clipboard access.",
      });
    }
  }

  function shareQuote() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.info("Share window opened", {
      description: "Your quote is ready to post.",
    });
  }

  function toggleFavorite() {
    if (!quote) {
      return;
    }

    setFavorites((currentFavorites) => {
      if (isFavorite) {
        toast.info("Removed from favorites");
        return currentFavorites.filter((favorite) => getQuoteId(favorite) !== favoriteId);
      }

      toast.success("Saved to favorites");
      return limitStoredQuotes([{ ...quote, provider }, ...currentFavorites], 30);
    });
  }

  function showPreviousQuote() {
    const previousQuote = history[1];

    if (previousQuote) {
      applyQuote(previousQuote, previousQuote.provider);
      toast.info("Previous quote restored");
    }
  }

  function generateAiQuote() {
    const topic = aiTopic.trim() || "growth";
    const generatedQuote = createTopicQuote(topic);
    applyQuote(generatedQuote, "AI-style local generator");
    toast.success("Topic quote generated", {
      description: `Topic: ${topic}`,
    });
  }

  function downloadQuoteImage() {
    if (!quote) {
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = 1200;
    canvas.height = 675;
    context.fillStyle = theme === "dark" ? "#111827" : "#f8fafc";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = theme === "dark" ? "#f8fafc" : "#0f172a";
    context.font = "700 52px Arial";
    wrapCanvasText(context, `"${quote.text}"`, 90, 190, 1020, 68);
    context.font = "500 30px Arial";
    context.fillStyle = theme === "dark" ? "#cbd5e1" : "#475569";
    context.fillText(`- ${quote.author}`, 90, 540);
    context.fillText(`Source: ${provider}`, 90, 590);

    const link = document.createElement("a");
    link.download = "random-quote.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Quote image downloaded");
  }

  return (
    <div className="w-full max-w-5xl space-y-4">
      <Card className="overflow-hidden border-border/80">
        <CardHeader className="border-b bg-secondary/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardDescription>Random Quote Generator</CardDescription>
              <CardTitle className="text-3xl">Fresh spark, one click away</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                aria-label="Toggle theme"
                onClick={() => {
                  setTheme((current) => {
                    const nextTheme = current === "dark" ? "light" : "dark";
                    toast.info(`${nextTheme === "dark" ? "Dark" : "Light"} mode enabled`);
                    return nextTheme;
                  });
                }}
                size="icon"
                title="Toggle theme"
                variant="outline"
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none ring-ring transition focus:ring-2"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search author or keyword"
                value={searchTerm}
              />
            </label>
            <select
              className="h-11 rounded-md border bg-background px-3 text-sm capitalize outline-none ring-ring transition focus:ring-2"
              onChange={(event) =>
                setSelectedCategory(event.target.value as (typeof categories)[number])
              }
              value={selectedCategory}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              className="h-11 rounded-md border bg-background px-3 text-sm outline-none ring-ring transition focus:ring-2"
              onChange={(event) => setAiTopic(event.target.value)}
              placeholder="Enter a topic for AI-style quote"
              value={aiTopic}
            />
            <Button onClick={generateAiQuote} variant="secondary">
              <Bot />
              Generate
            </Button>
          </div>

          <div className="min-h-72">
            {isLoading ? (
              <div className="space-y-5">
                <Skeleton className="h-8 w-11/12" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="mt-8 h-5 w-40" />
              </div>
            ) : quote ? (
              <figure className="flex min-h-56 flex-col justify-center gap-5">
                <blockquote className="text-balance text-3xl font-semibold leading-tight tracking-normal text-foreground sm:text-4xl">
                  {`"${quote.text}"`}
                </blockquote>
                <figcaption className="flex flex-wrap items-center gap-3 text-lg font-medium text-muted-foreground">
                  <span>- {quote.author}</span>
                  <Button onClick={() => setShowAuthor(true)} size="sm" variant="ghost">
                    <Info />
                    Author
                  </Button>
                </figcaption>
                {provider ? (
                  <p className="text-sm font-medium text-muted-foreground">
                    Source: {provider}
                  </p>
                ) : null}
              </figure>
            ) : (
              <p className="text-muted-foreground">No quote available right now.</p>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <MiniList
              emptyText="No favorites yet"
              items={favorites}
              onPick={(item) => applyQuote(item, item.provider)}
              title="Favorites"
            />
            <MiniList
              emptyText="No quote history yet"
              items={history.slice(0, 5)}
              onPick={(item) => applyQuote(item, item.provider)}
              title="History"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t bg-muted/35 p-6 lg:flex-row lg:justify-between">
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:w-auto">
            <Button disabled={isLoading} onClick={() => void fetchQuote()}>
              {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              New
            </Button>
            <Button disabled={history.length < 2} onClick={showPreviousQuote} variant="outline">
              <ChevronLeft />
              Back
            </Button>
            <Button disabled={!quote} onClick={toggleFavorite} variant={isFavorite ? "default" : "outline"}>
              <Heart className={cn(isFavorite && "fill-current")} />
              Save
            </Button>
          </div>
          <div className="grid w-full grid-cols-3 gap-3 lg:w-auto">
            <Button disabled={!quote || isLoading} onClick={() => void copyQuote()} variant="outline">
              <Copy />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button disabled={!quote || isLoading} onClick={downloadQuoteImage} variant="outline">
              <Download />
              Image
            </Button>
            <Button disabled={!quote || isLoading} onClick={shareQuote} variant="secondary">
              <Share2 />
              Share
            </Button>
          </div>
        </CardFooter>
      </Card>

      {showAuthor && quote ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{quote.author}</CardTitle>
              <CardDescription>Author details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{getAuthorSummary(quote.author)}</p>
              <p>Saved quotes from this author: {countAuthorQuotes(favorites, quote.author)}</p>
              <p>History appearances: {countAuthorQuotes(history, quote.author)}</p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => setShowAuthor(false)}>Close</Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function MiniList({
  emptyText,
  items,
  onPick,
  title,
}: {
  emptyText: string;
  items: StoredQuote[];
  onPick: (item: StoredQuote) => void;
  title: string;
}) {
  return (
    <div className="rounded-lg border bg-background/70 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <History className="size-4" />
        {title}
      </div>
      {items.length ? (
        <div className="space-y-2">
          {items.map((item) => (
            <button
              className="block w-full rounded-md px-2 py-2 text-left text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              key={`${title}-${getQuoteId(item)}`}
              onClick={() => onPick(item)}
              type="button"
            >
              <span className="line-clamp-1 font-medium text-foreground">{item.text}</span>
              <span>{item.author}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      )}
    </div>
  );
}

function readStoredQuotes(key: string): StoredQuote[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(key);

    return value ? (JSON.parse(value) as StoredQuote[]) : [];
  } catch {
    return [];
  }
}

function readTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
}

function getQuoteId(quote: Quote) {
  return `${quote.text}::${quote.author}`.toLowerCase();
}

function buildQuoteApiUrl(currentQuote: Quote | null, history: StoredQuote[]) {
  const params = new URLSearchParams();
  const excludedQuotes = [
    currentQuote,
    ...history.slice(0, 6),
  ].filter((item): item is Quote => Boolean(item));

  for (const item of excludedQuotes) {
    params.append("exclude", getQuoteId(item));
  }

  return params.size ? `/api/quote?${params.toString()}` : "/api/quote";
}

function limitStoredQuotes(quotes: StoredQuote[], limit = 12) {
  return quotes.slice(0, limit);
}

function getRandomQuote(quotes: readonly Quote[]) {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function inferCategory(quote: Quote) {
  const value = `${quote.text} ${quote.author}`.toLowerCase();

  if (/love|heart|relationship/.test(value)) {
    return "love";
  }

  if (/success|goal|win|achievement|victory/.test(value)) {
    return "success";
  }

  if (/learn|study|knowledge|teacher|wisdom/.test(value)) {
    return "study";
  }

  if (/code|technology|physics|genius|skill/.test(value)) {
    return "coding";
  }

  if (/life|live|day|growth|change/.test(value)) {
    return "life";
  }

  return "motivation";
}

function createTopicQuote(topic: string): Quote {
  const cleanTopic = topic.replace(/\s+/g, " ").trim();
  const templates = [
    `Progress in ${cleanTopic} starts when one clear action becomes a habit.`,
    `The best way to understand ${cleanTopic} is to practice it with patience.`,
    `${cleanTopic} becomes powerful when curiosity and consistency meet.`,
  ];

  return {
    text: templates[Math.floor(Math.random() * templates.length)],
    author: "Local AI-style generator",
  };
}

function getAuthorSummary(author: string) {
  if (author === "Unknown") {
    return "This quote does not include a known author in the current data source.";
  }

  return `${author} appears in your quote experience through live API results, saved favorites, or local fallback data.`;
}

function countAuthorQuotes(quotes: StoredQuote[], author: string) {
  return quotes.filter((item) => item.author === author).length;
}

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line, x, currentY);
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  const isCopied = document.execCommand("copy");
  textarea.remove();

  if (!isCopied) {
    throw new Error("Copy command failed");
  }
}
