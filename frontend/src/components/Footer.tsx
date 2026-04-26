import { Anchor } from "lucide-react";

export const Footer = () => (
  <footer className="relative border-t border-white/5 py-12 mt-12">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2.5">
        <div className="size-7 rounded-lg grid place-items-center shadow-glow">
           <img src="/logo_project.png" alt="" />
        </div>
        <span className="font-semibold tracking-tight text-sm">
          LogiSmar<span className="text-primary-glow">tech</span>
        </span>
        <span className="text-xs text-muted-foreground ml-2">The Intelligence Behind the Oriental's Export</span>
      </div>
      <div className="text-xs text-muted-foreground font-mono">
        © 2025 · Nador West Med · Hackathon edition
      </div>
    </div>
  </footer>
);
