import { QuoteCard } from "@/components/quote-card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)),transparent_32rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] px-5 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <QuoteCard />
      </section>
    </main>
  );
}
