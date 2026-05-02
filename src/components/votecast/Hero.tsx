import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-20 pb-12 md:pt-28 md:pb-20"
      aria-labelledby="hero-title"
    >
      {/* Background flourishes */}
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--cyan-glow), transparent 60%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-40 h-[300px] w-[300px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--coral), transparent 60%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
          <span>Your civic AI co-pilot — built for every voter</span>
        </motion.div>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        >
          The election process, <span className="text-gradient-cyan">finally</span>{" "}
          <span className="relative inline-block">
            simple.
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute -bottom-2 left-0 h-1.5 w-full origin-left rounded-full bg-coral"
              aria-hidden
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl"
        >
          From registration to results — explore the timeline, get answers from our AI assistant,
          and walk into the polling booth with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#timeline"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-cyan-glow px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-[1.03]"
            aria-label="Explore the election timeline"
          >
            Explore the timeline
            <ArrowDown
              className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
              aria-hidden
            />
          </a>
          <a
            href="#assistant"
            className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:bg-white/10"
            aria-label="Open the AI assistant"
          >
            Talk to the assistant
          </a>
        </motion.div>
      </div>
    </section>
  );
}
