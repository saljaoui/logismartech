import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Container, TrendingUp, Recycle } from "lucide-react";

const stats = [
  { icon: Container, value: "10×", label: "cheaper shipping", color: "primary" as const },
  { icon: TrendingUp, value: "30–60%", label: "farmer income boost", color: "accent" as const },
  { icon: Recycle, value: "0", label: "empty containers wasted", color: "primary" as const },
];

export const Hero = () => {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-7"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <Sparkles className="size-3.5 text-primary-glow" />
            <span>Live at Nador West Med · Hackathon 2025</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-semibold tracking-tightest text-5xl sm:text-6xl lg:text-7xl leading-[1.02] max-w-5xl mx-auto"
        >
          <span className="text-gradient">The AI Engine Behind the </span>
          <span className="text-gradient-primary">Oriental's Export</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 text-center text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Predicting empty container routes and using AI spatial optimization to connect local cooperatives to the world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#demo"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium shadow-glow transition-all hover:scale-[1.03]"
          >
            <span>Run the live demo</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#ecosystem"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all text-sm font-medium"
          >
            Explore the AI stack
          </a>
        </motion.div>

        {/* Stat badges */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass glass-hover px-5 py-4 flex items-center gap-4"
            >
              <div className={`size-11 rounded-xl grid place-items-center ${
                s.color === "primary"
                  ? "bg-primary/10 text-primary-glow shadow-glow"
                  : "bg-accent/10 text-accent-glow shadow-amber"
              }`}>
                <s.icon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight text-gradient">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
