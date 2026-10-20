import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommerce } from "@/components/storefront";
import { money } from "@/lib/catalog";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — CIAO D MILANO" },
      { name: "description", content: "Your CIAO D MILANO order has been placed successfully." },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { confirmationOrder } = useCommerce();
  const navigate = useNavigate();

  useEffect(() => {
    if (!confirmationOrder) {
      void navigate({ to: "/account", replace: true });
    }
  }, [confirmationOrder, navigate]);

  if (!confirmationOrder) {
    return (
      <section role="status" className="grid min-h-[60vh] place-items-center bg-paper px-6">
        <p className="text-sm text-stone">Opening your account…</p>
      </section>
    );
  }

  return (
    <section className="relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden bg-paper px-6 py-20 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(78vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-burgundy/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(62vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-burgundy/10"
      />
      <div className="editorial-rise mx-auto max-w-2xl">
        <div className="mx-auto grid size-20 place-items-center rounded-full border border-burgundy/25 bg-ivory text-burgundy">
          <Check className="size-8" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-burgundy">
          <Sparkles className="size-3" aria-hidden="true" />A moment to remember
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-7xl">Grazie.</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-stone">
          Order placed successfully. Your next chapter with the House is on its way.
        </p>
        <div className="mx-auto mt-8 inline-flex flex-col items-center border-y border-border px-10 py-4">
          <span className="text-[9px] uppercase tracking-[0.2em] text-stone">Order reference</span>
          <span className="mt-2 font-serif text-lg">{confirmationOrder.id}</span>
          <span className="mt-1 text-xs text-stone">{money(Number(confirmationOrder.total))}</span>
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild className="gap-2">
            <Link to="/account">
              View your orders <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/collections">Continue exploring</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
