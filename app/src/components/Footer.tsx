export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className=" bg-[var(--md-surface-container-low)] mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <p className="m-0 text-sm">
        &copy; {year} hiqueCa. All rights reserved.
      </p>
    </footer>
  );
}
