import { Vote } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass-strong border-b border-white/10">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
          aria-label="Main navigation"
        >
          <a href="#top" className="flex items-center gap-2.5" aria-label="Matachakra home">
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-cyan-glow glow-primary">
              <Vote className="h-5 w-5 text-primary-foreground" aria-hidden />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              Mata<span className="text-gradient-cyan">chakra</span>
            </span>
          </a>

          <ul className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <li><a href="#timeline" className="transition-colors hover:text-foreground">Timeline</a></li>
            <li><a href="#assistant" className="transition-colors hover:text-foreground">Assistant</a></li>
            <li><a href="#resources" className="transition-colors hover:text-foreground">Resources</a></li>
          </ul>

          <a
            href="#assistant"
            className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-coral-foreground transition-all hover:scale-105 hover:glow-coral"
            aria-label="Ask the Matachakra AI assistant"
          >
            Ask AI
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
