import { CoffeeExpBean } from "./CoffeeExpBean";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] p-4 backdrop-blur-lg">
      <div className="flex gap-2">
        <CoffeeExpBean />
        CoffeeExp
      </div>
    </header>
  );
}
