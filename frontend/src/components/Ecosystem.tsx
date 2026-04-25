import { motion } from "framer-motion";
import { MessageSquare, Check, FileText, Brain, Box, Layers } from "lucide-react";

const cardBase = "glass glass-hover relative overflow-hidden p-6 lg:p-7";

export const Ecosystem = () => {
  return (
    <section id="ecosystem" className="relative py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] uppercase tracking-widest text-muted-foreground mb-5">
            <span className="size-1.5 rounded-full bg-accent-glow" /> The AI Ecosystem
          </div>
          <h2 className="font-semibold tracking-tightest text-4xl sm:text-5xl text-gradient leading-[1.05]">
            Three intelligences. One unbroken supply chain.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            From the cooperative's WhatsApp to the customs clearance terminal — every step is anticipated, structured and optimized by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
          {/* Card 1: NLP Auto-Onboarding (wide) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`${cardBase} lg:col-span-3`}
          >
            <CardHeader icon={MessageSquare} tone="primary" eyebrow="01 · NLP Auto-Onboarding" title="From WhatsApp to customs-ready inventory." />
            <div className="mt-6 space-y-3">
              <ChatBubble side="user">I have 80 boxes of Argan oil 🫒</ChatBubble>
              <ChatBubble side="bot">
                <div className="font-medium text-foreground/90 text-sm mb-1">Parsed ✓</div>
                <div className="font-mono text-[11px] text-muted-foreground space-y-0.5">
                  <div><span className="text-primary-glow">product:</span> argan_oil</div>
                  <div><span className="text-primary-glow">qty:</span> 80 boxes · 12L each</div>
                  <div><span className="text-primary-glow">hs_code:</span> 1515.90.40</div>
                </div>
              </ChatBubble>
              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <FileText className="size-3.5 text-accent-glow" />
                Customs declaration auto-generated · EUR.1 form drafted
              </div>
            </div>
          </motion.div>

          {/* Card 2: Predictive Port ML */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`${cardBase} lg:col-span-3`}
          >
            <CardHeader icon={Brain} tone="accent" eyebrow="02 · Predictive Port ML" title="Forecasting empty containers, weeks ahead." />
            <div className="mt-6">
              <PredictionViz />
            </div>
          </motion.div>

          {/* Card 3: 3D Smart Groupage (full width) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`${cardBase} lg:col-span-6`}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <CardHeader icon={Box} tone="primary" eyebrow="03 · 3D Smart Groupage" title="Spatial AI packs every cubic centimeter." />
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Our spatial optimizer simulates millions of arrangements per second — combining honey jars, olive oil drums and argan boxes into a single 20ft container at <span className="text-foreground font-medium">93%+ fill rate</span>.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {["Weight balanced across axles", "Fragile goods auto-elevated", "Customs-stack order preserved"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-muted-foreground">
                      <span className="size-5 rounded-md bg-primary/10 grid place-items-center">
                        <Check className="size-3 text-primary-glow" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <ContainerViz />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CardHeader = ({ icon: Icon, eyebrow, title, tone }: { icon: any; eyebrow: string; title: string; tone: "primary" | "accent" }) => (
  <div>
    <div className="flex items-center gap-3">
      <div className={`size-10 rounded-xl grid place-items-center border border-white/10 ${
        tone === "primary" ? "bg-primary/10 text-primary-glow" : "bg-accent/10 text-accent-glow"
      }`}>
        <Icon className="size-5" />
      </div>
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{eyebrow}</span>
    </div>
    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gradient leading-snug">{title}</h3>
  </div>
);

const ChatBubble = ({ side, children }: { side: "user" | "bot"; children: React.ReactNode }) => (
  <div className={`flex ${side === "user" ? "justify-end" : "justify-start"}`}>
    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm border ${
      side === "user"
        ? "bg-[#005c4b] text-white border-white/5 rounded-br-md"
        : "bg-white/[0.04] border-white/10 rounded-bl-md text-foreground/90"
    }`}>
      {children}
    </div>
  </div>
);

const PredictionViz = () => {
  const ports = [
    { from: "Nador West Med", to: "Rotterdam", code: "MSC-8892", prob: 94 },
    { from: "Nador West Med", to: "Hamburg", code: "MAERSK-2210", prob: 87 },
    { from: "Tanger Med", to: "Algeciras", code: "CMA-4471", prob: 71 },
  ];
  return (
    <div className="space-y-3">
      {ports.map((p, i) => (
        <div key={p.code} className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-mono text-[11px] text-muted-foreground">{p.code}</div>
              <div className="text-sm font-medium">{p.from} → {p.to}</div>
            </div>
            <div className={`text-lg font-semibold tabular-nums ${i === 0 ? "text-accent-glow" : "text-foreground"}`}>{p.prob}%</div>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${p.prob}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${i === 0 ? "bg-gradient-amber" : "bg-gradient-primary"}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const ContainerViz = () => {
  // Stylized 3D container with stacked color blocks (honey, olive oil, argan)
  return (
    <div className="relative aspect-[5/3] rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_top,hsl(199_95%_30%/0.25),transparent_70%)] overflow-hidden p-6">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative h-full" style={{ perspective: "900px" }}>
        <motion.div
          initial={{ rotateY: -18, rotateX: 8 }}
          animate={{ rotateY: [-18, -12, -18], rotateX: [8, 12, 8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative mx-auto h-full w-[78%]"
        >
          {/* container outline */}
          <div className="absolute inset-0 rounded-md border-2 border-white/30 bg-gradient-to-br from-white/[0.03] to-white/[0.08] shadow-[0_0_60px_-10px_hsl(199_95%_50%/0.4)]">
            {/* top label */}
            <div className="absolute -top-6 left-2 text-[10px] font-mono text-muted-foreground">20ft · MSC-8892</div>
            {/* packed segments */}
            <div className="absolute inset-1.5 grid grid-cols-6 grid-rows-3 gap-1">
              {Array.from({ length: 18 }).map((_, idx) => {
                const palette = [
                  "bg-accent/70 border-accent-glow/60",     // honey
                  "bg-[hsl(85_60%_40%/0.7)] border-[hsl(85_70%_55%/0.6)]", // olive
                  "bg-[hsl(28_70%_45%/0.7)] border-[hsl(28_85%_60%/0.6)]", // argan
                ];
                const c = palette[idx % 3];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 * idx }}
                    className={`rounded-sm border ${c}`}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
          <Legend dot="bg-accent" label="Aïcha Honey" />
          <Legend dot="bg-[hsl(85_60%_45%)]" label="Olive Oil" />
          <Legend dot="bg-[hsl(28_70%_50%)]" label="Argan" />
          <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/15 text-primary-glow border border-primary/30 font-medium">
            <Layers className="size-3 inline -mt-0.5 mr-1" />93% fill
          </span>
        </div>
      </div>
    </div>
  );
};

const Legend = ({ dot, label }: { dot: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className={`size-2 rounded-full ${dot}`} />
    <span>{label}</span>
  </div>
);
