import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchRemoteQuote } from "@/lib/quote-providers";
import { getFallbackQuote, getQuoteId } from "@/lib/quotes";
import { getLocalQuotes } from "@/lib/local-quotes";

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const excludedQuoteIds = new Set(
    request.nextUrl.searchParams
      .getAll("exclude")
      .map((quoteId) => quoteId.toLowerCase()),
  );
  const remoteQuote = await fetchRemoteQuote(excludedQuoteIds);

  if (remoteQuote) {
    return NextResponse.json({
      quote: remoteQuote.quote,
      source: "api",
      provider: remoteQuote.provider,
    });
  }

  return NextResponse.json(
    {
      quote: getLocalFallbackQuote(excludedQuoteIds),
      source: "fallback",
      provider: "Local fallback",
      message: "Showing a fallback quote because all live quote APIs are unavailable.",
    },
    { status: 200 },
  );
}

function getLocalFallbackQuote(excludedQuoteIds: Set<string>) {
  const availableQuotes = getLocalQuotes().filter(
    (quote) => !excludedQuoteIds.has(getQuoteId(quote)),
  );

  if (!availableQuotes.length) {
    return getFallbackQuote();
  }

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);

  return availableQuotes[randomIndex];
}
