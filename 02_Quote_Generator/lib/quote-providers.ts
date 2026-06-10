import type { Quote } from "@/lib/quotes";
import { getQuoteId, normalizeQuote } from "@/lib/quotes";

export type RemoteQuoteResult = Readonly<{
  quote: Quote;
  provider: string;
}>;

type QuoteProvider = Readonly<{
  name: string;
  url: string;
}>;

const quoteProviders = Object.freeze([
  {
    name: "ZenQuotes",
    url: "https://zenquotes.io/api/random",
  },
  {
    name: "QuotesDB",
    url: "https://quotes-db.vercel.app/api/random",
  },
  {
    name: "QuoteSlate",
    url: "https://quoteslate.vercel.app/api/quotes/random",
  },
] satisfies readonly QuoteProvider[]);

export async function fetchRemoteQuote(
  excludedQuoteIds = new Set<string>(),
): Promise<RemoteQuoteResult | null> {
  for (const provider of quoteProviders) {
    const quote = await fetchQuoteFromProvider(provider);

    if (quote && !excludedQuoteIds.has(getQuoteId(quote))) {
      return {
        quote,
        provider: provider.name,
      };
    }
  }

  return null;
}

async function fetchQuoteFromProvider(
  provider: QuoteProvider,
): Promise<Quote | null> {
  try {
    const url = new URL(provider.url);
    url.searchParams.set("_", `${Date.now()}-${Math.random()}`);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      return null;
    }

    const payload: unknown = await response.json();

    return normalizeQuote(payload);
  } catch {
    return null;
  }
}
