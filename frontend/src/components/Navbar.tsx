// import { Anchor, Github, Twitter } from "lucide-react";

export const Navbar = () => (
  <header className="fixed top-0 inset-x-0 z-50">
    <div className="container mx-auto mt-4 px-4">
      <div className="glass flex items-center justify-between px-5 py-3">
        <a href="#" className="flex items-center gap-2.5">
          <div className="relative">
            <div className="size-8 rounded-lg grid place-items-center shadow-glow">
              <img src="/logo_project.png" alt="" />
            </div>
          </div>
          <span className="font-semibold tracking-tight text-[15px]">
            LogiSmar<span className="text-primary-glow">tech</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#ecosystem" className="hover:text-foreground transition-colors">AI Ecosystem</a>
          <a href="#demo" className="hover:text-foreground transition-colors">Live Demo</a>
          <a href="#port" className="hover:text-foreground transition-colors">Port Advantage</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#demo" className="hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            Launch Demo
          </a>
        </div>
      </div>
    </div>
  </header>
);
