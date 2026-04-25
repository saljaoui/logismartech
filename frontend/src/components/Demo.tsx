import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Ship, Package, CheckCircle2, FileCheck, Loader2, Sparkles } from "lucide-react";

const containers = [
  { code: "MSC-8892", route: "Nador → Hamburg", eta: "T+4d", prob: 94 },
  { code: "MAERSK-2210", route: "Nador → Rotterdam", eta: "T+6d", prob: 87 },
  { code: "CMA-4471", route: "Nador → Marseille", eta: "T+8d", prob: 78 },
];

const stock = [
  { name: "Aïcha Honey", coop: "Coop Aït Bouayach", qty: "1.2 t", color: "bg-accent" },
  { name: "Hassan Olive Oil", coop: "Coop Beni Sidel", qty: "850 L", color: "bg-[hsl(85_60%_45%)]" },
  { name: "Argan Boxes", coop: "Coop Targuist", qty: "80 ×", color: "bg-[hsl(28_70%_50%)]" },
];

export const Demo = () => {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = useState(0);

  const run = () => {
    if (state === "running") return;
    setState("running");
    setProgress(0);
    const target = 93;
    const start = performance.now();
    const dur = 1800;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else setState("done");
    };
    requestAnimationFrame(step);
  };

  const reset = () => { setState("idle"); setProgress(0); };

  return (
    <section id="demo" className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(199_95%_30%/0.15),transparent_60%)] pointer-events-none" />
      <div className="container relative mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] uppercase tracking-widest text-muted-foreground mb-5">
            <span className="size-1.5 rounded-full bg-primary-glow animate-pulse" /> Live Command Center
          </div>
          <h2 className="font-semibold tracking-tightest text-4xl sm:text-5xl text-gradient leading-[1.05]">
            See the AI orchestrate a full export — in 2 seconds.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Predicted empty containers meet local cooperative stock. One click runs spatial optimization, fills the container and auto-generates customs documents.
          </p>
        </div>

        <div className="glass p-6 lg:p-8 ring-1 ring-white/[0.04]">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* LEFT — Inputs */}
            <div className="space-y-6">
              <Panel title="Predicted Empty Containers" icon={Ship} count={containers.length}>
                <div className="space-y-2.5">
                  {containers.map((c, i) => (
                    <div key={c.code} className={`group flex items-center justify-between rounded-xl border px-3.5 py-3 transition-all ${
                      i === 0
                        ? "border-primary/40 bg-primary/5 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.15)]"
                        : "border-white/5 bg-white/[0.02]"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`size-9 rounded-lg grid place-items-center ${i === 0 ? "bg-primary/15 text-primary-glow" : "bg-white/5 text-muted-foreground"}`}>
                          <Ship className="size-4" />
                        </div>
                        <div>
                          <div className="font-mono text-[11px] text-muted-foreground">{c.code} · {c.eta}</div>
                          <div className="text-sm font-medium">{c.route}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-semibold tabular-nums ${i === 0 ? "text-primary-glow" : "text-foreground"}`}>{c.prob}%</div>
                        <div className="text-[10px] text-muted-foreground">match</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Available Local Stock" icon={Package} count={stock.length}>
                <div className="space-y-2.5">
                  {stock.map((s) => (
                    <div key={s.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`size-2.5 rounded-full ${s.color} shadow-[0_0_12px_currentColor]`} />
                        <div>
                          <div className="text-sm font-medium">{s.name}</div>
                          <div className="text-[11px] text-muted-foreground">{s.coop}</div>
                        </div>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">{s.qty}</div>
                    </div>
                  ))}
                </div>
              </Panel>

              <button
                onClick={run}
                disabled={state === "running"}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-primary px-6 py-4 font-medium text-primary-foreground shadow-glow animate-pulse-glow disabled:opacity-80 disabled:cursor-wait transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.25)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2.5">
                  {state === "running" ? (
                    <><Loader2 className="size-5 animate-spin" /> Optimizing spatial layout…</>
                  ) : (
                    <><Zap className="size-5" /> Run AI Spatial Optimization</>
                  )}
                </span>
              </button>
            </div>

            {/* RIGHT — Output */}
            <div className="rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_top,hsl(199_95%_30%/0.18),transparent_70%)] p-6 min-h-[560px] flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Container · MSC-8892</div>
                  <div className="text-base font-semibold mt-0.5">Spatial fit simulation</div>
                </div>
                {state === "done" && (
                  <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">↻ Reset</button>
                )}
              </div>

              {/* Progress + capacity bar */}
              <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Container capacity</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tabular-nums text-gradient">{progress}</span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="relative h-3 rounded-full bg-white/[0.04] overflow-hidden border border-white/5">
                  {/* Segmented fills */}
                  <div className="absolute inset-0 flex">
                    <Segment width={progress * 0.4} color="bg-accent" />
                    <Segment width={progress * 0.35} color="bg-[hsl(85_60%_45%)]" />
                    <Segment width={progress * 0.25} color="bg-[hsl(28_70%_50%)]" />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                  <Dot c="bg-accent" l="Honey · 37%" />
                  <Dot c="bg-[hsl(85_60%_45%)]" l="Olive Oil · 33%" />
                  <Dot c="bg-[hsl(28_70%_50%)]" l="Argan · 23%" />
                  <Dot c="bg-white/20" l="Air gap · 7%" />
                </div>
              </div>

              {/* Container fill visual */}
              <div className="relative flex-1 rounded-xl border border-white/10 bg-black/30 overflow-hidden p-3">
                <div className="absolute top-2 left-3 font-mono text-[10px] text-muted-foreground">20ft DRY · 33 m³</div>
                <div className="h-full grid grid-cols-10 grid-rows-4 gap-1">
                  {Array.from({ length: 40 }).map((_, idx) => {
                    const filled = idx < Math.round((progress / 100) * 40);
                    const palette = [
                      "bg-accent/80 border-accent-glow/40 shadow-[0_0_12px_hsl(var(--accent)/0.4)]",
                      "bg-[hsl(85_60%_40%/0.8)] border-[hsl(85_70%_55%/0.4)]",
                      "bg-[hsl(28_70%_45%/0.8)] border-[hsl(28_85%_60%/0.4)]",
                    ];
                    const c = palette[idx % 3];
                    return (
                      <motion.div
                        key={idx}
                        animate={{ opacity: filled ? 1 : 0.08, scale: filled ? 1 : 0.85 }}
                        transition={{ duration: 0.25 }}
                        className={`rounded-sm border ${filled ? c : "border-white/5 bg-white/[0.02]"}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Success badge */}
              <AnimatePresence>
                {state === "done" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-5 rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-lg bg-accent/20 grid place-items-center shrink-0 shadow-amber">
                        <CheckCircle2 className="size-5 text-accent-glow" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <span className="font-semibold">Cost per coop: <span className="text-accent-glow">~$350</span></span>
                          <span className="text-xs text-muted-foreground">vs. ~$3,500 solo shipment</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FileCheck className="size-3.5 text-primary-glow" />
                          Customs Docs Auto-Generated via AI
                          <Sparkles className="size-3 text-accent-glow ml-1" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Panel = ({ title, icon: Icon, count, children }: { title: string; icon: any; count: number; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-4">
    <div className="flex items-center justify-between mb-3.5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4 text-primary-glow" />
        {title}
      </div>
      <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{count}</span>
    </div>
    {children}
  </div>
);

const Segment = ({ width, color }: { width: number; color: string }) => (
  <motion.div
    animate={{ width: `${width}%` }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`h-full ${color}`}
  />
);

const Dot = ({ c, l }: { c: string; l: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={`size-2 rounded-full ${c}`} />
    {l}
  </span>
);
