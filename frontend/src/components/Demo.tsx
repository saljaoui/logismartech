import { type ElementType, type ReactNode, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileCheck, Loader2, Package, Ship, Sparkles, Zap } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchContainers,
  fetchCooperatives,
  runAiOptimization,
  type ContainerPrediction,
  type CooperativeStock,
  type OptimizeResponse,
} from "@/lib/api";

type RunState = "idle" | "running" | "done";

type SegmentSpec = {
  key: string;
  label: string;
  width: number;
  barColor: string;
  dotColor: string;
  cellColor: string;
  percentage: number;
};

const SEGMENT_COLORS = [
  {
    bar: "bg-accent",
    dot: "bg-accent",
    cell: "bg-accent/80 border-accent-glow/40 shadow-[0_0_12px_hsl(var(--accent)/0.4)]",
  },
  {
    bar: "bg-[hsl(85_60%_45%)]",
    dot: "bg-[hsl(85_60%_45%)]",
    cell: "bg-[hsl(85_60%_40%/0.8)] border-[hsl(85_70%_55%/0.4)]",
  },
  {
    bar: "bg-[hsl(28_70%_50%)]",
    dot: "bg-[hsl(28_70%_50%)]",
    cell: "bg-[hsl(28_70%_45%/0.8)] border-[hsl(28_85%_60%/0.4)]",
  },
] as const;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatWeightKg(weight: number) {
  if (weight >= 1000) {
    return `${(weight / 1000).toFixed(1)} t`;
  }
  return `${Math.round(weight)} kg`;
}

function formatVolumeM3(volume: number) {
  return `${volume.toFixed(1)} m³`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "AI Engine unreachable. Please check server connection.";
}

function buildGridPalette(segments: SegmentSpec[], fillRate: number) {
  const filledCells = Math.round((fillRate / 100) * 40);
  if (filledCells <= 0 || segments.length === 0) {
    return [] as string[];
  }

  const palette: string[] = [];
  let assigned = 0;

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const targetCells = isLast
      ? filledCells - assigned
      : Math.max(0, Math.round((segment.width / Math.max(fillRate, 1)) * filledCells));

    for (let i = 0; i < targetCells; i += 1) {
      palette.push(segment.cellColor);
    }

    assigned += targetCells;
  });

  while (palette.length < filledCells) {
    palette.push(segments[0].cellColor);
  }

  return palette.slice(0, filledCells);
}

export const Demo = () => {
  const [containers, setContainers] = useState<ContainerPrediction[]>([]);
  const [cooperatives, setCooperatives] = useState<CooperativeStock[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(null);
  const [optimization, setOptimization] = useState<OptimizeResponse | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [state, setState] = useState<RunState>("idle");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setInitialLoading(true);
      setInitialError(null);

      try {
        const [containersData, cooperativesData] = await Promise.all([fetchContainers(), fetchCooperatives()]);

        if (!active) {
          return;
        }

        setContainers(containersData);
        setCooperatives(cooperativesData);
        setSelectedContainerId((previous) => previous ?? containersData[0]?.id ?? null);
      } catch (error) {
        if (!active) {
          return;
        }

        const message = getErrorMessage(error);
        setInitialError(message);
        toast.error(message);
      } finally {
        if (active) {
          setInitialLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const selectedContainer =
    containers.find((container) => container.id === selectedContainerId) ?? containers[0] ?? null;

  const fillRate = useMemo(() => {
    return optimization?.optimization.metrics.finalFillRate ?? 0;
  }, [optimization]);

  const segments = useMemo<SegmentSpec[]>(() => {
    const matches = optimization?.optimization.matchedCooperatives ?? [];

    if (!matches.length || fillRate <= 0) {
      return [];
    }

    const totalAllocatedVolume = matches.reduce((sum, match) => sum + match.allocatedVolume, 0);

    return matches.map((match, index) => {
      const colors = SEGMENT_COLORS[index % SEGMENT_COLORS.length];
      const volumeShare = totalAllocatedVolume > 0 ? match.allocatedVolume / totalAllocatedVolume : 0;
      const width = fillRate * volumeShare;

      return {
        key: `${match.id}-${index}`,
        label: match.productType,
        width,
        barColor: colors.bar,
        dotColor: colors.dot,
        cellColor: colors.cell,
        percentage: width,
      };
    });
  }, [fillRate, optimization]);

  const airGap = Math.max(0, 100 - fillRate);
  const gridPalette = useMemo(() => buildGridPalette(segments, fillRate), [segments, fillRate]);

  const handleRunOptimization = async () => {
    if (!selectedContainer || state === "running") {
      return;
    }

    setState("running");
    setRunError(null);

    const startedAt = Date.now();

    try {
      const response = await runAiOptimization(selectedContainer.id);
      const elapsed = Date.now() - startedAt;
      if (elapsed < 1500) {
        await wait(1500 - elapsed);
      }

      setOptimization(response);
      setState("done");
    } catch (error) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 1500) {
        await wait(1500 - elapsed);
      }

      const message = getErrorMessage(error);
      setRunError(message);
      setState("idle");
      toast.error(message);
    }
  };

  const resetSimulation = () => {
    setOptimization(null);
    setRunError(null);
    setState("idle");
  };

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
          {initialError && (
            <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground flex items-start gap-2">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <span>{initialError}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              <Panel title="Predicted Empty Containers" icon={Ship} count={containers.length}>
                {initialLoading ? (
                  <div className="space-y-2.5">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-[68px] rounded-xl bg-white/5" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {containers.map((container) => {
                      const isActive = selectedContainer?.id === container.id;
                      return (
                        <button
                          key={container.id}
                          type="button"
                          onClick={() => setSelectedContainerId(container.id)}
                          className={`w-full text-left group flex items-center justify-between rounded-xl border px-3.5 py-3 transition-all ${
                            isActive
                              ? "border-primary/40 bg-primary/5 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.15)]"
                              : "border-white/5 bg-white/[0.02] hover:border-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-9 rounded-lg grid place-items-center ${
                                isActive ? "bg-primary/15 text-primary-glow" : "bg-white/5 text-muted-foreground"
                              }`}
                            >
                              <Ship className="size-4" />
                            </div>
                            <div>
                              <div className="font-mono text-[11px] text-muted-foreground">
                                {container.containerNumber}
                              </div>
                              <div className="text-sm font-medium">Nador → {container.destinationPort}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-sm font-semibold tabular-nums ${
                                isActive ? "text-primary-glow" : "text-foreground"
                              }`}
                            >
                              {container.confidenceScore}%
                            </div>
                            <div className="text-[10px] text-muted-foreground">match</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Panel>

              <Panel title="Available Local Stock" icon={Package} count={cooperatives.length}>
                {initialLoading ? (
                  <div className="space-y-2.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-[62px] rounded-xl bg-white/5" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cooperatives.map((cooperative, index) => {
                      const dotColor = SEGMENT_COLORS[index % SEGMENT_COLORS.length].dot;

                      return (
                        <div
                          key={cooperative.id}
                          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`size-2.5 rounded-full ${dotColor} shadow-[0_0_12px_currentColor]`} />
                            <div>
                              <div className="text-sm font-medium">{cooperative.productType}</div>
                              <div className="text-[11px] text-muted-foreground">{cooperative.name}</div>
                            </div>
                          </div>
                          <div className="font-mono text-xs text-muted-foreground text-right">
                            <div>{formatWeightKg(cooperative.availableWeight)}</div>
                            <div>{formatVolumeM3(cooperative.availableVolume)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>

              <button
                type="button"
                onClick={handleRunOptimization}
                disabled={state === "running" || !selectedContainer || initialLoading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-primary px-6 py-4 font-medium text-primary-foreground shadow-glow animate-pulse-glow disabled:opacity-80 disabled:cursor-wait transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.25)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2.5">
                  {state === "running" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" /> Optimizing spatial layout…
                    </>
                  ) : (
                    <>
                      <Zap className="size-5" /> Run AI Spatial Optimization
                    </>
                  )}
                </span>
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_top,hsl(199_95%_30%/0.18),transparent_70%)] p-6 min-h-[560px] flex flex-col relative overflow-hidden">
              <AnimatePresence>
                {state === "running" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm p-6 flex flex-col justify-center"
                  >
                    <div className="mx-auto w-full max-w-sm space-y-4">
                      <div className="flex items-center justify-center gap-2 text-primary-glow">
                        <Loader2 className="size-5 animate-spin" />
                        <span className="text-sm font-medium">Running spatial optimizer...</span>
                      </div>
                      <Skeleton className="h-3 rounded-full bg-white/10" />
                      <Skeleton className="h-28 rounded-xl bg-white/10" />
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 8 }).map((_, index) => (
                          <Skeleton key={index} className="h-8 rounded bg-white/10" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Container · {selectedContainer?.containerNumber || "N/A"}
                  </div>
                  <div className="text-base font-semibold mt-0.5">Spatial fit simulation</div>
                </div>
                {state === "done" && (
                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ↻ Reset
                  </button>
                )}
              </div>

              {runError && (
                <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                  {runError}
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Container capacity</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tabular-nums text-gradient">
                      {Math.round(fillRate)}
                    </span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="relative h-3 rounded-full bg-white/[0.04] overflow-hidden border border-white/5">
                  <div className="absolute inset-0 flex">
                    {segments.map((segment) => (
                      <Segment key={segment.key} width={segment.width} color={segment.barColor} />
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                  {segments.map((segment) => (
                    <Dot
                      key={`legend-${segment.key}`}
                      c={segment.dotColor}
                      l={`${segment.label} · ${segment.percentage.toFixed(1)}%`}
                    />
                  ))}
                  <Dot c="bg-white/20" l={`Air gap · ${airGap.toFixed(1)}%`} />
                </div>
              </div>

              <div className="relative flex-1 rounded-xl border border-white/10 bg-black/30 overflow-hidden p-3">
                <div className="absolute top-2 left-3 font-mono text-[10px] text-muted-foreground">
                  20ft DRY · {optimization?.container.maxVolume || 33} m³
                </div>
                <div className="h-full grid grid-cols-10 grid-rows-4 gap-1">
                  {Array.from({ length: 40 }).map((_, index) => {
                    const filled = index < gridPalette.length;
                    const colorClass = filled ? gridPalette[index] : "border-white/5 bg-white/[0.02]";

                    return (
                      <motion.div
                        key={index}
                        animate={{ opacity: filled ? 1 : 0.08, scale: filled ? 1 : 0.85 }}
                        transition={{ duration: 0.25 }}
                        className={`rounded-sm border ${colorClass}`}
                      />
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {state === "done" && optimization && (
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
                          <span className="font-semibold">
                            Fill rate: <span className="text-accent-glow">{optimization.optimization.metrics.finalFillRate}%</span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {optimization.optimization.matchedCooperatives.length} coops matched
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FileCheck className="size-3.5 text-primary-glow" />
                          {optimization.optimization.customsManifest.fileName} · {optimization.optimization.customsManifest.status}
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

const Panel = ({
  title,
  icon: Icon,
  count,
  children,
}: {
  title: string;
  icon: ElementType;
  count: number;
  children: ReactNode;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-4">
    <div className="flex items-center justify-between mb-3.5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4 text-primary-glow" />
        {title}
      </div>
      <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
        {count}
      </span>
    </div>
    {children}
  </div>
);

const Segment = ({ width, color }: { width: number; color: string }) => (
  <motion.div
    animate={{ width: `${width}%` }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className={`h-full ${color}`}
  />
);

const Dot = ({ c, l }: { c: string; l: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={`size-2 rounded-full ${c}`} />
    {l}
  </span>
);
