import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/catalog";
import { useProductsByIds } from "@/lib/catalog-api";
import { useCommerce } from "@/components/storefront";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — CIAO D MILANO" },
      {
        name: "description",
        content: "Enter your card details to complete your CIAO D MILANO order.",
      },
      { property: "og:title", content: "Payment — CIAO D MILANO" },
      { property: "og:description", content: "Secure card payment for your CIAO D MILANO order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Payment,
});

const fieldCls =
  "w-full bg-transparent border-b border-paper/30 pb-1 text-paper placeholder:text-paper/40 outline-none focus:border-sand transition-colors";

function Payment() {
  const {
    account,
    cart,
    checkoutItems,
    checkoutDetails,
    sessionToken,
    addOrder,
    completeCheckout,
    requireSignIn,
  } = useCommerce();
  const navigate = useNavigate();
  const requestedSignIn = useRef(false);
  const [num, setNum] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const itemsToCheckout = checkoutItems ?? cart;
  const { data: lines, isLoading, error } = useProductsByIds(
    Object.keys(itemsToCheckout).filter((id) => (itemsToCheckout[id] ?? 0) > 0),
  );
  const total = lines.reduce(
    (sum, product) => sum + product.price * (itemsToCheckout[product.id] ?? 0),
    0,
  );

  useEffect(() => {
    if (!account && !requestedSignIn.current) {
      requestedSignIn.current = true;
      requireSignIn(() => void navigate({ to: "/payment" }));
      return;
    }
    if (account && !isLoading && !error && (!checkoutDetails || lines.length === 0)) {
      void navigate({ to: "/checkout" });
    }
  }, [account, checkoutDetails, error, isLoading, lines.length, navigate, requireSignIn]);

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account || !sessionToken || !checkoutDetails || lines.length === 0) {
      setPaymentError("Your checkout details are missing. Please return to checkout.");
      return;
    }

    setIsPaying(true);
    setPaymentError("");
    try {
      const apiBaseUrl = import.meta.env["VITE_API_URL"] ?? "http://localhost:3001";
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/account/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          contact: {
            firstName: checkoutDetails.firstName,
            lastName: checkoutDetails.lastName,
            email: account.email,
            phone: checkoutDetails.phone,
          },
          shippingAddress: {
            firstName: checkoutDetails.firstName,
            lastName: checkoutDetails.lastName,
            address: checkoutDetails.address,
            city: checkoutDetails.city,
            postalCode: checkoutDetails.postalCode,
            country: checkoutDetails.country,
          },
          paymentMethod: "credit_card",
          items: lines.map((product) => ({
            productId: product.id,
            quantity: itemsToCheckout[product.id],
          })),
        }),
      });
      const result = (await response.json()) as { message?: string; orderNumber?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save your order.");
      }
      if (!result.orderNumber) {
        throw new Error("The order service did not return an order number.");
      }

      addOrder({
        id: result.orderNumber,
        status: "Payment simulated",
        date: new Date().toISOString(),
        total,
        currency: "EUR",
        items: lines.map((product) => ({
          name: product.name,
          quantity: itemsToCheckout[product.id] ?? 0,
        })),
      });
      completeCheckout();
      setNum("");
      setExp("");
      setCvc("");
      setName("");
      setDone(true);
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Unable to reach the order service.",
      );
    } finally {
      setIsPaying(false);
    }
  }

  if (!account) {
    return (
      <section
        role="status"
        className="flex min-h-[60vh] items-center justify-center px-6 text-center"
      >
        <p className="text-sm text-stone">Please sign in to continue to payment.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section role="alert" className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="text-sm text-stone">
          {error instanceof Error ? error.message : "Unable to load payment products."}
        </p>
      </section>
    );
  }
  if (isLoading) {
    return (
      <section role="status" className="flex min-h-[60vh] items-center justify-center px-6 text-center">
        <p className="text-sm text-stone">Loading payment products…</p>
      </section>
    );
  }

  if (!checkoutDetails || lines.length === 0) {
    return (
      <section
        role="status"
        className="flex min-h-[60vh] items-center justify-center px-6 text-center"
      >
        <p className="text-sm text-stone">Returning you to checkout to complete your details.</p>
      </section>
    );
  }

  const fmtNum = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  };

  if (done)
    return (
      <section className="flex min-h-[65vh] flex-col items-center justify-center px-6 text-center editorial-rise">
        <p className="text-[10px] uppercase tracking-[.2em] text-stone">Order Confirmed</p>
        <h1 className="mt-4 font-serif text-5xl">Grazie.</h1>
        <p className="mt-4 max-w-md text-sm text-stone">
          Your demo payment was recorded and your order details have been saved.
        </p>
      </section>
    );

  return (
    <form
      onSubmit={submitPayment}
      className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-10"
    >
      <div>
        <p className="text-[10px] uppercase tracking-[.2em] text-stone">Step 04</p>
        <h1 className="mt-2 font-serif text-5xl">Payment</h1>
        <p className="mt-3 text-sm text-stone">
          Enter your details directly on the card. Tap the card to see the reverse.
        </p>

        <div className="mt-10 max-w-[480px] [perspective:1600px]">
          <div
            className="relative aspect-[1.586/1] w-full transition-transform duration-700 [transform-style:preserve-3d]"
            style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl p-6 text-paper shadow-xl sm:p-7 [backface-visibility:hidden]"
              style={{
                background:
                  "linear-gradient(118deg, oklch(0.26 0.014 70) 0%, oklch(0.175 0.008 70) 34%, oklch(0.115 0 0) 66%, oklch(0.215 0.016 55) 100%)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(112deg, transparent 22%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.02) 52%, transparent 66%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-sand/15"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-8 h-64 w-64 rounded-full border border-sand/10"
              />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* EMV chip */}
                  <div
                    className="relative h-10 w-[52px] overflow-hidden rounded-[6px]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--sand) 0%, var(--stone) 48%, var(--sand) 62%, var(--stone) 100%)",
                      boxShadow:
                        "inset 0 1px 1px rgba(255,255,255,.55), inset 0 -1px 2px rgba(0,0,0,.45)",
                    }}
                    aria-hidden
                  >
                    <div
                      className="absolute inset-0 opacity-55"
                      style={{
                        background:
                          "repeating-linear-gradient(0deg, transparent 0 5px, rgba(0,0,0,.28) 5px 6px), repeating-linear-gradient(90deg, transparent 0 12px, rgba(0,0,0,.22) 12px 13px)",
                      }}
                    />
                    <div className="absolute left-0 right-0 top-1/2 h-px bg-ink/30" />
                  </div>
                  {/* Contactless */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className="text-paper/70"
                    aria-hidden
                  >
                    <path d="M6 8.5a9 9 0 0 1 0 7" />
                    <path d="M9.5 10a5.5 5.5 0 0 1 0 4" />
                    <path d="M13 11.5a2.5 2.5 0 0 1 0 1" />
                  </svg>
                </div>
                <span className="font-serif text-lg tracking-wide">
                  CIAO D <span className="text-sand">Milano</span>
                </span>
              </div>

              <label className="block">
                <span className="sr-only">Card number</span>
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  value={num}
                  onFocus={() => setFlipped(false)}
                  onChange={(e) => setNum(fmtNum(e.target.value))}
                  pattern="(\d{4} ){3}\d{4}"
                  className={`${fieldCls} font-mono text-xl tracking-[.14em] sm:text-2xl`}
                  style={{
                    textShadow: "0 1px 0 rgba(255,255,255,.16), 0 -1px 1px rgba(0,0,0,.85)",
                  }}
                />
              </label>

              <div className="grid grid-cols-[minmax(0,1fr)_112px] items-end gap-6">
                <label className="block">
                  <span className="text-[9px] uppercase tracking-[.2em] text-paper/50">
                    Card Holder
                  </span>
                  <input
                    required
                    autoComplete="cc-name"
                    placeholder="FULL NAME"
                    value={name}
                    onFocus={() => setFlipped(false)}
                    onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 26))}
                    className={`${fieldCls} mt-1 text-sm uppercase tracking-[.12em]`}
                    style={{
                      textShadow: "0 1px 0 rgba(255,255,255,.14), 0 -1px 1px rgba(0,0,0,.8)",
                    }}
                  />
                </label>
                <label className="block">
                  <span className="text-[9px] uppercase tracking-[.2em] text-paper/50">
                    Valid Thru
                  </span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    value={exp}
                    onFocus={() => setFlipped(false)}
                    onChange={(e) => setExp(fmtExp(e.target.value))}
                    pattern="(0[1-9]|1[0-2]) / \d{2}"
                    className={`${fieldCls} mt-1 font-mono text-sm tracking-[.12em]`}
                    style={{
                      textShadow: "0 1px 0 rgba(255,255,255,.14), 0 -1px 1px rgba(0,0,0,.8)",
                    }}
                  />
                </label>
                {/* Network mark */}
                <div className="flex -space-x-3" aria-hidden>
                  <div
                    className="h-8 w-8 rounded-full bg-sand/85"
                    style={{ boxShadow: "inset 0 0 4px rgba(0,0,0,.25)" }}
                  />
                  <div className="h-8 w-8 rounded-full bg-burgundy/90 opacity-85" />
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 overflow-hidden rounded-xl text-paper [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{
                background:
                  "linear-gradient(118deg, oklch(0.24 0.014 70) 0%, oklch(0.16 0.008 70) 40%, oklch(0.115 0 0) 75%, oklch(0.2 0.016 55) 100%)",
              }}
            >
              <div
                className="mt-7 h-12 w-full"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.08 0 0), oklch(0.14 0 0) 55%, oklch(0.09 0 0))",
                }}
              />
              {/* Hologram */}
              <div
                aria-hidden
                className="absolute right-5 top-14 h-12 w-12 rounded-full opacity-90"
                style={{
                  background:
                    "conic-gradient(from 40deg, var(--sand), var(--burgundy), var(--stone), var(--ivory), var(--sand))",
                  boxShadow: "0 1px 3px rgba(0,0,0,.5), inset 0 0 6px rgba(255,255,255,.4)",
                }}
              />
              <div className="mx-6 mt-6 flex items-stretch gap-3">
                <div
                  className="flex min-w-0 flex-1 items-center bg-paper"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent 0 7px, rgba(0,0,0,.05) 7px 8px)",
                  }}
                >
                  <svg
                    viewBox="0 0 120 36"
                    className="h-9 w-full text-ink/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M6 26c10-16 18-16 24-6s12 10 20-2 16-12 24-4 14 6 20-4 14-6 20 2" />
                  </svg>
                </div>
                <label className="block w-24">
                  <span className="text-[9px] uppercase tracking-[.2em] text-paper/50">CVC</span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    value={cvc}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    pattern="\d{3,4}"
                    className={`${fieldCls} mt-1 bg-paper/10 px-2 font-mono tracking-[.3em]`}
                  />
                </label>
              </div>
              <div className="absolute bottom-5 left-6 right-6 flex items-baseline justify-between gap-4">
                <p className="text-[9px] uppercase tracking-[.18em] text-paper/40">
                  Authorised signature · Not valid unless signed
                </p>
                <p className="hidden shrink-0 text-[9px] uppercase tracking-[.18em] text-paper/30 sm:block">
                  CIAO D MILANO · Milano IT
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="mt-5 text-[10px] uppercase tracking-[.2em] underline underline-offset-4"
        >
          {flipped ? "Show front" : "Enter security code"}
        </button>
        <p className="mt-8 text-xs text-stone">
          Payments are encrypted. This is a demo — no card will be charged.
        </p>
      </div>

      <aside className="bg-ivory p-6 lg:sticky lg:top-24 lg:self-start">
        <h2 className="font-serif text-2xl">Order Summary</h2>
        <div className="mt-6 space-y-5">
          {lines.map((p) => (
            <div key={p.id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-3">
              <img
                src={p.image}
                alt=""
                width={128}
                height={160}
                className="aspect-[3/4] object-cover"
              />
              <div>
                <p className="text-sm">{p.name}</p>
                <p className="mt-1 text-xs text-stone">Qty {itemsToCheckout[p.id]}</p>
              </div>
              <span className="text-sm">{money(p.price * (itemsToCheckout[p.id] ?? 0))}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between border-t border-border pt-5">
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-6 w-full"
          disabled={!lines.length || isPaying}
        >
          {isPaying ? "Saving order..." : `Pay ${money(total)}`}
        </Button>
        {paymentError && (
          <p
            role="alert"
            className="mt-4 border-l-2 border-burgundy px-3 py-2 text-xs text-burgundy"
          >
            {paymentError}
          </p>
        )}
        <Link
          to="/checkout"
          className="mt-4 block text-center text-[10px] uppercase tracking-[.2em] text-stone underline underline-offset-4"
        >
          Back to checkout
        </Link>
      </aside>
    </form>
  );
}
