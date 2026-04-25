import { motion } from "framer-motion";
import { Anchor, Globe2, Gauge, Train, Ship, ArrowUpRight } from "lucide-react";

const advantages = [
  { icon: Gauge, value: "2.5M", unit: "TEU", label: "annual capacity", tone: "primary" },
  { icon: Globe2, value: "30+", unit: "routes", label: "direct European lines", tone: "accent" },
  { icon: Train, value: "1.2k km", unit: "rail", label: "to EU heartland", tone: "primary" },
  { icon: Ship, value: "18 m", unit: "draft", label: "deep-water berths", tone: "accent" },
];

export const Port = () => {
  return (
    <section id="port" className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38_95%_35%/0.18),transparent_55%)] pointer-events-none" />
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] uppercase tracking-widest text-muted-foreground mb-5">
              <Anchor className="size-3 text-accent-glow" /> The Port Advantage
            </div>
            <h2 className="font-semibold tracking-tightest text-4xl sm:text-5xl text-gradient leading-[1.05]">
              Built on Nador West Med — the new gateway to Europe.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              A deep-water mega-port, 14 km from the Spanish coast, with direct corridors to Rotterdam, Hamburg, Marseille and Algeciras. LogiSmartech turns this strategic asset into a programmable export engine for the Oriental region.
            </p>
            <a href="#demo" className="inline-flex items-center gap-1.5 mt-7 text-sm font-medium text-primary-glow hover:gap-2.5 transition-all">
              Run the demo with live port data <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {advantages.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass glass-hover p-6 group"
              >
                <div className={`size-11 rounded-xl grid place-items-center border border-white/10 mb-5 ${
                  a.tone === "primary" ? "bg-primary/10 text-primary-glow" : "bg-accent/10 text-accent-glow"
                }`}>
                  <a.icon className="size-5" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold tracking-tight text-gradient tabular-nums">{a.value}</span>
                  <span className="text-xs text-muted-foreground font-mono">{a.unit}</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{a.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
