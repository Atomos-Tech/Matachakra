import { Vote } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-cyan-glow">
            <Vote className="h-4 w-4 text-primary-foreground" aria-hidden />
          </div>
          <span className="font-display font-semibold text-foreground">Matachakra</span>
          <span>· Empowering every voter.</span>
        </div>
        <p>© {new Date().getFullYear()} Matachakra. Built for civic clarity.</p>
      </div>
    </footer>
  );
}
