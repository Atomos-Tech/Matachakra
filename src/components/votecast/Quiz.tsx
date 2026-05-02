import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, X, RotateCcw } from "lucide-react";

const OPTIONS = ["16", "18", "21"] as const;
const CORRECT = "18";

export function Quiz() {
  const [selected, setSelected] = useState<string | null>(null);

  const reset = () => setSelected(null);

  return (
    <section id="quiz" className="relative px-6 py-20" aria-labelledby="quiz-title">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-coral">
            <Brain className="h-4 w-4" aria-hidden /> Quick Check
          </p>
          <h2 id="quiz-title" className="font-display text-4xl font-bold md:text-5xl">
            Test Your <span className="text-gradient-cyan">Voter IQ</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            One question at a time — see how well you know the basics.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 shadow-[var(--shadow-elevated)] md:p-10"
        >
          <div
            className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--cyan-glow), transparent 60%)" }}
            aria-hidden
          />

          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-primary">Question 01</p>
            <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">
              What is the minimum age to register to vote in India?
            </h3>

            <div
              className="mt-8 grid gap-3 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Answer options"
            >
              {OPTIONS.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = opt === CORRECT;
                const showState = selected !== null;
                const stateClasses = !showState
                  ? "border-white/10 bg-white/5 text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10"
                  : isCorrect
                    ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-300"
                    : isSelected
                      ? "border-coral/60 bg-coral/10 text-coral"
                      : "border-white/5 bg-white/[0.02] text-muted-foreground/60";

                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Answer ${opt} years`}
                    disabled={showState}
                    onClick={() => setSelected(opt)}
                    className={`group relative flex items-center justify-between rounded-2xl border px-5 py-4 text-left font-display text-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-default ${stateClasses}`}
                  >
                    <span>{opt}</span>
                    {showState && isCorrect && <Check className="h-5 w-5" aria-hidden />}
                    {showState && isSelected && !isCorrect && <X className="h-5 w-5" aria-hidden />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center"
                >
                  <p className="text-sm text-foreground/90">
                    {selected === CORRECT ? (
                      <>
                        ✅ <strong className="font-semibold">Correct!</strong> You must be 18+ on
                        the qualifying date (Jan 1) to register.
                      </>
                    ) : (
                      <>
                        ❌ Not quite. The correct answer is{" "}
                        <strong className="font-semibold text-emerald-300">18</strong> — the minimum
                        voting age in India.
                      </>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Try the question again"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/10"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
