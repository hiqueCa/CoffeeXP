import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="px-4 py-10">
      <section className="flex flex-col gap-3 justify-start">
        <span className="cj-eyebrow">A COFFEE JOURNAL - EST.2026</span>
        <h1 className="cj-h1">
          <p>Your morning cup,</p>
          <p className="italic text-[var(--md-primary)]">remembered.</p>
        </h1>
        <p className="cj-meta max-w-[460px]">
          A quiet place to note what you brewed, how it tasted, and what you'd change tomorrow. No streaks. No noise.
          Just the cup in front of you.
        </p>
      </section>
    </main>
  );
}
