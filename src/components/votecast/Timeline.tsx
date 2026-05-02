import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserPlus, Megaphone, CheckSquare, BarChart3, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StateSelect } from "./StateSelect";

type Step = {
  id: string;
  label: string;
  short: string;
  icon: LucideIcon;
  steps: string[];
};

const STEPS: Step[] = [
  {
    id: "register",
    label: "Voter Registration",
    short: "Get on the rolls",
    icon: UserPlus,
    steps: [
      "Check if you're 18+ on the qualifying date",
      "Fill Form 6 online or at your local office",
      "Upload an ID and address proof",
      "Track your application until approved",
    ],
  },
  {
    id: "campaign",
    label: "Pre-Election Campaigning",
    short: "Know the candidates",
    icon: Megaphone,
    steps: [
      "Review every candidate on your ballot",
      "Read manifestos & past performance",
      "Attend public debates or watch online",
      "Verify claims with trusted fact-checkers",
    ],
  },
  {
    id: "poll",
    label: "Polling Day",
    short: "Cast your vote",
    icon: CheckSquare,
    steps: [
      "Find your booth using your EPIC number",
      "Carry a valid photo ID — no phones inside",
      "Verify your name on the electoral roll",
      "Cast your vote on the EVM and confirm VVPAT",
    ],
  },
  {
    id: "results",
    label: "Results",
    short: "Track the count",
    icon: BarChart3,
    steps: [
      "Counting begins on the announced date",
      "Follow live updates from the Election Commission",
      "Understand margins, swings & vote share",
      "See certified results once announced",
    ],
  },
];

export function Timeline() {
  const [activeId, setActiveId] = useState<string>("register");
  const active = STEPS.find((s) => s.id === activeId)!;

  return (
    <section id="timeline" className="relative px-6 py-20" aria-labelledby="timeline-title">
      <div className="mx-auto max-w-7xl">
        <StateSelect />
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            The Roadmap
          </p>
          <h2 id="timeline-title" className="font-display text-4xl font-bold md:text-5xl">
            Learn the steps in <span className="text-gradient-cyan">4 stages</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Tap any node to expand the actionable steps for that stage.
          </p>
        </div>

        {/* Timeline rail */}
        <div className="relative mb-10">
          <div
            className="absolute left-0 right-0 top-1/2 hidden h-[2px] -translate-y-1/2 md:block"
            style={{
              background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.15), transparent)",
            }}
            aria-hidden
          />
          <ol
            className="relative grid gap-4 md:grid-cols-4"
            role="tablist"
            aria-label="Election stages"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = step.id === activeId;
              const activeIndex = STEPS.findIndex((s) => s.id === activeId);
              const isPast = i < activeIndex;
              return (
                <li key={step.id} className="relative flex flex-col items-center">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${step.id}`}
                    aria-label={`Stage ${i + 1}: ${step.label}`}
                    onClick={() => setActiveId(step.id)}
                    className="group relative flex flex-col items-center focus:outline-none"
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 280, damping: 20 }}
                      className={`relative grid h-16 w-16 place-items-center rounded-2xl border transition-all ${
                        isActive
                          ? "border-primary bg-gradient-to-br from-primary to-cyan-glow text-primary-foreground glow-primary"
                          : isPast
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-white/10 bg-white/5 text-muted-foreground group-hover:border-white/25 group-hover:text-foreground"
                      }`}
                    >
                      {isPast ? (
                        <Check className="h-6 w-6" aria-hidden />
                      ) : (
                        <Icon className="h-6 w-6" aria-hidden />
                      )}
                      <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-background text-[10px] font-bold ring-1 ring-white/10">
                        {i + 1}
                      </span>
                    </motion.div>
                    <div className="mt-4 text-center">
                      <p
                        className={`font-display text-sm font-semibold transition-colors ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">{step.short}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Expanded panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            id={`panel-${active.id}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="glass-strong mx-auto max-w-4xl rounded-3xl p-8 shadow-[var(--shadow-elevated)] md:p-10"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-cyan-glow text-primary-foreground">
                <active.icon className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary">Stage</p>
                <h3 className="font-display text-2xl font-bold">{active.label}</h3>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {active.steps.map((step, i) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-coral/15 text-xs font-bold text-coral">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/90">{step}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
