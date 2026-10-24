import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function PiecesLoading({
  label = "Loading pieces",
  compact = false,
  className,
}: {
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  const Wrapper = compact ? "span" : "div";

  return (
    <Wrapper
      role="status"
      className={cn(
        compact
          ? "inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]"
          : "flex flex-col items-center justify-center gap-4 py-16 text-stone",
        className,
      )}
    >
      <span
        className={cn("pieces-loading-mark", compact && "pieces-loading-mark-compact")}
        aria-hidden="true"
      >
        <span className="pieces-loading-orbit pieces-loading-orbit-outer" />
        <span className="pieces-loading-orbit pieces-loading-orbit-inner" />
        <Sparkles
          className={cn("pieces-loading-sparkle", compact && "pieces-loading-sparkle-compact")}
        />
      </span>
      <span className="pieces-loading-label" aria-hidden="true">
        {label}
        <span className="pieces-loading-dots">...</span>
      </span>
      <span className="sr-only">{label}</span>
    </Wrapper>
  );
}
