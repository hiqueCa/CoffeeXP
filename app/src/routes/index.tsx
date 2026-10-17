import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="px-4 py-10">
      <section className="flex flex-col gap-2">
        <span>A coffee journal</span>
        <div>
          <p>Your morning cup,</p>
          <p>remembered</p>
        </div>
        <span>
          A quiet place to note what you brewed, how it tasted, and what you'd change tomorrow. No streaks. No noise.
          Just the cup in front of you.
        </span>
      </section>
    </main>
  );
}
