"use client";

import * as React from "react";
import type { QuizItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LS_PREFIX = "mcp-mastery-quiz:";

export function QuizBlock({ slug, items }: { slug: string; items: QuizItem[] }) {
  const storageKey = `${LS_PREFIX}${slug}`;
  const [selections, setSelections] = React.useState<number[]>(() =>
    items.map(() => -1),
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { selections?: number[]; attempts?: number; submitted?: boolean };
      if (Array.isArray(parsed.selections) && parsed.selections.length === items.length) {
        setSelections(parsed.selections as number[]);
      }
      if (typeof parsed.attempts === "number") setAttempts(parsed.attempts);
      if (typeof parsed.submitted === "boolean") setSubmitted(parsed.submitted);
    } catch {
      /* ignore */
    }
  }, [items.length, storageKey]);

  const persist = React.useCallback(
    (next: { selections: number[]; attempts: number; submitted: boolean }) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const score = React.useMemo(() => {
    if (!submitted) return null;
    let ok = 0;
    items.forEach((q, i) => {
      if (selections[i] === q.answer) ok += 1;
    });
    return ok;
  }, [items, selections, submitted]);

  return (
    <section className="my-8 rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-lg font-semibold">Quiz</h3>
      <ol className="space-y-4">
        {items.map((q, qi) => (
          <li key={qi} className="rounded-md border bg-background/60 p-3">
            <p className="mb-2 text-sm font-medium">{q.q}</p>
            <div className="space-y-1">
              {q.options.map((opt, oi) => {
                const selected = selections[qi] === oi;
                const show = submitted;
                const correct = oi === q.answer;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted}
                    onClick={() => {
                      const next = [...selections];
                      next[qi] = oi;
                      setSelections(next);
                      persist({ selections: next, attempts, submitted });
                    }}
                    className={cn(
                      "flex w-full items-start gap-2 rounded border px-2 py-1.5 text-left text-sm hover:bg-muted/60",
                      selected && "border-primary",
                      show && correct && "border-emerald-500 bg-emerald-500/10",
                      show && selected && !correct && "border-red-500 bg-red-500/10",
                    )}
                  >
                    <span className="mt-0.5 font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + oi)}.</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {submitted ? (
              <p className="mt-2 text-xs text-muted-foreground">{q.explain}</p>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!submitted ? (
          <Button
            type="button"
            onClick={() => {
              const nextAttempts = attempts + 1;
              setAttempts(nextAttempts);
              setSubmitted(true);
              persist({ selections, attempts: nextAttempts, submitted: true });
            }}
          >
            Submit answers
          </Button>
        ) : (
          <>
            <p className="text-sm font-medium">
              Score: {score}/{items.length} (attempts recorded locally: {attempts})
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const resetSel = items.map(() => -1);
                setSelections(resetSel);
                setSubmitted(false);
                persist({ selections: resetSel, attempts, submitted: false });
              }}
            >
              Retry
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
