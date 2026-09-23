import Link from "next/link";

import type { Dict } from "@/lib/i18n";

export function SentisFooter({ dict }: { dict: Dict }) {
  return (
    <footer className="border-rule border-t">
      <div className="mx-auto flex w-full max-w-(--container-page) flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-display text-ink text-lg font-semibold tracking-tight">
          {dict.pied.droits}
        </p>
        <p className="text-ink-muted text-sm">
          {dict.pied.mention}{" "}
          <Link
            href="/nexus"
            className="hover:text-ink focus-visible:ring-signal -my-1 inline-block rounded-sm py-1 underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            NEXUS UI
          </Link>
        </p>
      </div>
    </footer>
  );
}
