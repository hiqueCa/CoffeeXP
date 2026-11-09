import { CoffeeExpBean } from "#/components/CoffeeExpBean";
import { GoogleMark } from "#/components/GoogleMark";
import { authClient } from "@coffeeExp/auth/client";
import { createFileRoute } from "@tanstack/react-router";
import v60StillLife from "../../assets/v60-still-life.avif";

const year = new Date().getFullYear();

export const Route = createFileRoute("/")({ component: IndexPage });

function IndexPage() {
  const handleSignIn = async () => {
    authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--md-surface)] text-[var(--md-on-surface)]">
      <header className="flex items-center gap-3 px-[18px] py-5 min-[900px]:px-7">
        <CoffeeExpBean />
        <span className="cj-brand">CoffeeXP</span>
      </header>

      <main className="grid flex-1 content-start px-[18px] [grid-template-areas:'hero'_'image'_'action'] min-[900px]:grid-cols-[1.1fr_1fr] min-[900px]:content-center min-[900px]:gap-x-8 min-[900px]:px-7 min-[900px]:[grid-template-areas:'hero_image'_'action_image']">
        <section className="flex flex-col gap-4 pt-6 pb-5 [grid-area:hero] min-[900px]:self-end">
          <span className="cj-eyebrow">A coffee journal · est. 2026</span>
          <h1 className="cj-h1 m-0">
            Your morning cup,<br />
            <em className="text-[var(--md-primary)]">remembered.</em>
          </h1>
          <p className="cj-meta m-0 max-w-[460px] leading-[1.55]!">
            A quiet place to note what you brewed, how it tasted, and what you'd change tomorrow. No streaks. No noise.
            Just the cup in front of you.
          </p>
        </section>

        <div className="cj-ph h-[200px] overflow-hidden [grid-area:image] min-[900px]:h-[280px] min-[900px]:self-center">
          <img
            className="block h-full w-full object-cover object-center"
            src={v60StillLife}
            alt="Still life of a Hario V60 pour-over dripper"
          />
        </div>

        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3 pt-7 pb-3 [grid-area:action] min-[900px]:mx-0 min-[900px]:max-w-[360px] min-[900px]:self-start min-[900px]:pt-5">
          <button type="button" className="cj-btn tonal h-12! w-full gap-3!" onClick={handleSignIn}>
            <GoogleMark />
            Continue with Google
          </button>
          <p className="m-0 text-center text-xs tracking-[0.2px] text-[var(--md-outline)]">
            We only use your name, email and photo from Google.
          </p>
        </div>
      </main>

      <footer className="mt-6 border-t border-[var(--md-outline-variant)] bg-[var(--md-surface-container-low)] px-[18px] pt-6 pb-7 min-[900px]:px-7">
        <p className="cj-faint m-0 mt-5 text-xs ">
          &copy; {year}
          <a href="https://github.com/hiqueCa" target="_blank" rel="noopener noreferrer">{" hiqueCa"}</a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
