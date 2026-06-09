import { getRandomLocalQuote } from "@/lib/local-quotes";

export type Quote = {
  text: string;
  author: string;
};

export function getFallbackQuote(): Quote {
  return getRandomLocalQuote();
}

export function getQuoteId(quote: Quote): string {
  return `${quote.text}::${quote.author}`.toLowerCase();
}

export function normalizeQuote(payload: unknown): Quote | null {
  const quoteSource = unwrapQuotePayload(payload);

  if (!quoteSource || typeof quoteSource !== "object") {
    return null;
  }

  const record = quoteSource as Record<string, unknown>;
  const text = pickString(record, [
    "text",
    "quote",
    "q",
    "content",
    "quoteText",
    "body",
    "message",
  ]);
  const author = pickString(record, [
    "author",
    "a",
    "quoteAuthor",
    "by",
    "name",
    "source",
  ]);

  if (!text) {
    return null;
  }

  return {
    text,
    author: author || "Unknown",
  };
}

function unwrapQuotePayload(payload: unknown): unknown {
  if (Array.isArray(payload)) {
    return payload[0];
  }

  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const record = payload as Record<string, unknown>;

  if (Array.isArray(record.data)) {
    return record.data[0];
  }

  if (record.data && typeof record.data === "object") {
    return record.data;
  }

  if (Array.isArray(record.quotes)) {
    return record.quotes[0];
  }

  if (record.quote && typeof record.quote === "object") {
    return record.quote;
  }

  return payload;
}

function pickString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}
