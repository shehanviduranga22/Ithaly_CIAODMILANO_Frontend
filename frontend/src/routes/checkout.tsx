import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiecesLoading } from "@/components/pieces-loading";
import { useCommerce } from "@/components/storefront";
import { money } from "@/lib/catalog";
import { useProductsByIds } from "@/lib/catalog-api";
import dubaiDeliveryBanner from "@/assets/dubai-delivery-banner.jpg";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — CIAO D MILANO" },
      { name: "description", content: "Secure checkout for your CIAO D MILANO order." },
      { property: "og:title", content: "Checkout — CIAO D MILANO" },
      { property: "og:description", content: "Complete your CIAO D MILANO order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { account, cart, checkoutItems, checkoutDetails, requireSignIn, setCheckoutDetails } =
    useCommerce();
  const navigate = useNavigate();
  const requestedSignIn = useRef(false);
  const itemsToCheckout = checkoutItems ?? cart;
  const {
    data: lines,
    isLoading,
    error,
  } = useProductsByIds(Object.keys(itemsToCheckout).filter((id) => (itemsToCheckout[id] ?? 0) > 0));
  const total = lines.reduce(
    (sum, product) => sum + product.price * (itemsToCheckout[product.id] ?? 0),
    0,
  );

  useEffect(() => {
    if (account || requestedSignIn.current) return;
    requestedSignIn.current = true;
    requireSignIn(() => void navigate({ to: "/checkout" }));
  }, [account, navigate, requireSignIn]);

  if (!account) {
    return (
      <section
        role="status"
        className="flex min-h-[60vh] items-center justify-center px-6 text-center"
      >
        <p className="text-sm text-stone">Please sign in to continue to checkout.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className="flex min-h-[60vh] items-center justify-center px-6 text-center"
      >
        <p className="text-sm text-stone">
          {error instanceof Error ? error.message : "Unable to load checkout products."}
        </p>
      </section>
    );
  }
  if (isLoading) {
    return <PiecesLoading label="Loading checkout products" className="min-h-[60vh] px-6" />;
  }

  function continueToPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setCheckoutDetails({
      phone: String(formData.get("phone") ?? "").trim(),
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
      country: String(formData.get("country") ?? "").trim(),
    });
    void navigate({ to: "/payment" });
  }

  return (
    <>
      <section className="relative isolate min-h-[300px] overflow-hidden bg-ink-deep sm:min-h-[320px]">
        <img
          src={dubaiDeliveryBanner}
          alt=""
          width={1920}
          height={768}
          className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/70 to-ink-deep/20" />
        <div className="relative mx-auto grid min-h-[300px] max-w-[1440px] items-center gap-8 px-6 py-12 sm:min-h-[320px] lg:grid-cols-[minmax(0,1fr)_220px] lg:px-10">
          <div className="max-w-2xl text-paper">
            <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-sand">
              The final details
            </p>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
              A considered order, from our house to yours.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-paper/75">
              A few thoughtful details bring your chosen pieces one step closer.
            </p>
          </div>
          <div aria-hidden="true" className="hidden justify-self-center lg:block">
            <div className="rotate-[-4deg] border border-sand/70 px-8 py-10 text-center text-sand">
              <p className="font-serif text-3xl tracking-[0.12em]">CIAO D</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.35em]">Milano</p>
            </div>
          </div>
        </div>
      </section>
      <form
        onSubmit={continueToPayment}
        className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-10"
      >
        <div>
          <h1 className="font-serif text-5xl">Checkout</h1>
          <CheckoutSection n="01" title="Contact Information">
            <Input
              required
              name="email"
              type="email"
              value={account.email}
              readOnly
              placeholder="Email address"
            />
            <Input
              required
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue={checkoutDetails?.phone}
              placeholder="Phone number"
              className="mt-4"
            />
          </CheckoutSection>
          <CheckoutSection n="02" title="Shipping Address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                required
                name="firstName"
                autoComplete="given-name"
                defaultValue={checkoutDetails?.firstName ?? account.firstName}
                placeholder="First name"
              />
              <Input
                required
                name="lastName"
                autoComplete="family-name"
                defaultValue={checkoutDetails?.lastName ?? account.lastName}
                placeholder="Last name"
              />
              <Input
                required
                name="address"
                autoComplete="street-address"
                defaultValue={checkoutDetails?.address}
                placeholder="Address"
                className="sm:col-span-2"
              />
              <Input
                required
                name="city"
                autoComplete="address-level2"
                defaultValue={checkoutDetails?.city}
                placeholder="City"
              />
              <Input
                required
                name="postalCode"
                autoComplete="postal-code"
                defaultValue={checkoutDetails?.postalCode}
                placeholder="Postal code"
              />
              <Input
                required
                name="country"
                autoComplete="country-name"
                defaultValue={checkoutDetails?.country}
                placeholder="Country"
                className="sm:col-span-2"
              />
            </div>
          </CheckoutSection>
          <CheckoutSection n="03" title="Delivery Method">
            <label className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 border border-ink p-4 text-sm">
              <input type="radio" defaultChecked />
              <span>
                Express Delivery
                <br />
                <small className="text-stone">2–4 business days</small>
              </span>
              <span>Complimentary</span>
            </label>
          </CheckoutSection>
        </div>
        <aside className="bg-ivory p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-serif text-2xl">Order Summary</h2>
          <div className="mt-6 space-y-5">
            {lines.map((product) => (
              <div key={product.id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-3">
                <img
                  src={product.image}
                  alt=""
                  width={128}
                  height={160}
                  className="aspect-[3/4] object-cover"
                />
                <div>
                  <p className="text-sm">{product.name}</p>
                  <p className="mt-1 text-xs text-stone">Qty {itemsToCheckout[product.id]}</p>
                </div>
                <span className="text-sm">
                  {money(product.price * (itemsToCheckout[product.id] ?? 0))}
                </span>
              </div>
            ))}
            {lines.length === 0 && (
              <p className="text-sm text-stone">Your order is ready for its first piece.</p>
            )}
          </div>
          <div className="mt-6 flex justify-between border-t border-border pt-5">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={!lines.length}>
            Place Order
          </Button>
        </aside>
      </form>
    </>
  );
}

function CheckoutSection({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-border pt-6">
      <p className="text-[9px] uppercase tracking-[.18em] text-stone">{n}</p>
      <h2 className="mb-6 mt-2 font-serif text-2xl">{title}</h2>
      {children}
    </section>
  );
}
