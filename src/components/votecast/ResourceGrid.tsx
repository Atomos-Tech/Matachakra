import { motion } from "framer-motion";
import { ShieldCheck, EyeOff, Accessibility, FileText, CreditCard, Home } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PollingBoothLocator } from "./PollingBoothLocator";

type Resource = {
  icon: LucideIcon;
  title: string;
  body: string;
  tag: "Right" | "Document";
};

const RESOURCES: Resource[] = [
  {
    icon: ShieldCheck,
    title: "Right to Vote Freely",
    body: "Cast your ballot without coercion, intimidation, or interference from anyone — at any booth, on any day.",
    tag: "Right",
  },
  {
    icon: EyeOff,
    title: "Secret Ballot",
    body: "Your vote is private. No one — not officials, parties, or family — has the right to know your choice.",
    tag: "Right",
  },
  {
    icon: Accessibility,
    title: "Accessible Voting",
    body: "Ramps, wheelchairs, sign-language assistance, and Braille ballots are guaranteed at every booth.",
    tag: "Right",
  },
  {
    icon: CreditCard,
    title: "Voter ID (EPIC)",
    body: "Your primary photo ID issued by the Election Commission. Carry the original on polling day.",
    tag: "Document",
  },
  {
    icon: FileText,
    title: "Government Photo ID",
    body: "Aadhaar, Passport, Driving Licence, or PAN — any one works as backup if your EPIC isn't with you.",
    tag: "Document",
  },
  {
    icon: Home,
    title: "Address Proof",
    body: "Utility bill, bank passbook, or rental agreement — needed when registering or updating your address.",
    tag: "Document",
  },
];

export function ResourceGrid() {
  return (
    <section id="resources" className="relative px-6 py-20" aria-labelledby="resources-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Know Before You Go
            </p>
            <h2 id="resources-title" className="font-display text-4xl font-bold md:text-5xl">
              Your <span className="text-gradient-cyan">rights</span> & required{" "}
              <span className="text-gradient-cyan">documents</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            A quick reference card you can return to anytime — bookmark it before election day.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r, i) => {
            const Icon = r.icon;
            const isRight = r.tag === "Right";
            return (
              <motion.li
                key={r.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <article className="glass group relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]">
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-xl ${
                        isRight
                          ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                          : "bg-coral/15 text-coral ring-1 ring-coral/30"
                      }`}
                    >
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        isRight ? "bg-primary/10 text-primary" : "bg-coral/10 text-coral"
                      }`}
                    >
                      {r.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                </article>
              </motion.li>
            );
          })}
        </ul>

        {/* ── Google Maps Integration — Find Your Polling Booth ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
          aria-labelledby="maps-section-title"
        >
          <div className="mb-6 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Powered by Google Maps
            </p>
            <h2 id="maps-section-title" className="font-display text-3xl font-bold md:text-4xl">
              Find your <span className="text-gradient-cyan">Polling Booth</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Use the interactive map below to locate polling stations near you. Always verify your
              exact booth number on the official ECI portal at{" "}
              <a
                href="https://electoralsearch.eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
                aria-label="Open ECI electoral search portal in a new tab"
              >
                electoralsearch.eci.gov.in
              </a>
              .
            </p>
          </div>
          <PollingBoothLocator />
        </motion.div>
      </div>
    </section>
  );
}
