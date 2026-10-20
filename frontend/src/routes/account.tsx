import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import atelierImage from "@/assets/ciao-women.jpg";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Private Client Account — CIAO D MILANO" },
      { name: "description", content: "Sign in or create your CIAO D MILANO private client account." },
      { property: "og:title", content: "Private Client Account — CIAO D MILANO" },
      { property: "og:description", content: "Access orders, saved pieces and private collection previews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Account,
});

function PasswordField({ placeholder }: { placeholder: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        required
        minLength={8}
        maxLength={72}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className="h-12 pr-12"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-1 top-1 h-10 w-10 text-stone hover:bg-transparent hover:text-ink"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  );
}

function Account() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [message, setMessage] = useState("");

  function selectMode(nextMode: "signin" | "register") {
    setMode(nextMode);
    setMessage("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (mode === "register") {
      const data = new FormData(form);
      const password = String(data.get("password") ?? "");
      const confirmation = String(data.get("confirmation") ?? "");
      if (password !== confirmation) {
        setMessage("Passwords do not match.");
        return;
      }
    }

    setMessage(mode === "signin" ? "Welcome back. Your private account is being prepared." : "Thank you. Your private account request has been received.");
  }

  const isRegister = mode === "register";

  return (
    <section className="grid min-h-[calc(100svh-4rem)] bg-ivory lg:grid-cols-[minmax(0,1.08fr)_minmax(480px,0.92fr)]">
      <div className="relative min-h-[42svh] overflow-hidden bg-ink-deep lg:min-h-[760px]">
        <img
          src={atelierImage}
          alt="CIAO D MILANO atelier campaign"
          width={1024}
          height={1280}
          className="editorial-fade absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-transparent to-ink-deep/10" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-paper sm:p-10 lg:p-14">
          <p className="text-[10px] uppercase tracking-[0.22em] text-sand">The Private Client</p>
          <blockquote className="mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
            A more personal way to experience the house.
          </blockquote>
          <p className="mt-5 max-w-sm text-sm leading-6 text-paper/75">
            Save considered pieces, revisit your orders and receive first access to new collections.
          </p>
        </div>
      </div>

      <div className="flex items-center px-6 py-14 sm:px-12 lg:px-16 xl:px-24">
        <div className="editorial-rise mx-auto w-full max-w-lg">
          <div className="flex border-b border-ink" role="tablist" aria-label="Account access">
            <Button
              type="button"
              variant="ghost"
              role="tab"
              aria-selected={!isRegister}
              onClick={() => selectMode("signin")}
              className={`h-12 flex-1 border-b-2 px-2 ${!isRegister ? "border-ink text-ink" : "border-transparent text-stone"}`}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant="ghost"
              role="tab"
              aria-selected={isRegister}
              onClick={() => selectMode("register")}
              className={`h-12 flex-1 border-b-2 px-2 ${isRegister ? "border-ink text-ink" : "border-transparent text-stone"}`}
            >
              Create Account
            </Button>
          </div>

          <div className="py-9 sm:py-11">
            <p className="text-[10px] uppercase tracking-[0.22em] text-stone">CIAO D MILANO</p>
            <h1 className="mt-4 font-serif text-4xl leading-none sm:text-5xl">
              {isRegister ? "Join the House" : "Welcome Back"}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone">
              {isRegister
                ? "Create your private account for a considered and personal shopping experience."
                : "Sign in to view your orders, saved pieces and private collection previews."}
            </p>
          </div>

          <form onSubmit={submit} className="grid gap-4" noValidate={false}>
            {isRegister && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input required name="firstName" maxLength={50} autoComplete="given-name" placeholder="First name" className="h-12" />
                <Input required name="lastName" maxLength={50} autoComplete="family-name" placeholder="Last name" className="h-12" />
              </div>
            )}
            <Input required name="email" type="email" maxLength={255} autoComplete="email" placeholder="Email address" className="h-12" />
            <PasswordField placeholder="Password" />
            {isRegister && <PasswordField placeholder="Confirm password" />}

            {!isRegister && (
              <div className="flex justify-end">
                <Button type="button" variant="link" className="h-auto px-0 text-[10px] text-stone">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button size="lg" type="submit" className="mt-2 h-13 w-full">
              {isRegister ? "Create My Account" : "Enter My Account"}
            </Button>

            {message && (
              <p role="status" className={`border-l-2 px-4 py-3 text-xs ${message.startsWith("Passwords") ? "border-burgundy text-burgundy" : "border-ink text-ink"}`}>
                {message}
              </p>
            )}
          </form>

          <div className="mt-10 border-t border-border pt-7">
            <p className="text-[10px] uppercase tracking-[0.18em] text-stone">Private account privileges</p>
            <ul className="mt-5 grid gap-3 text-xs text-ink sm:grid-cols-2">
              {["Saved pieces", "Order history", "Faster checkout", "Collection previews"].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <Check className="size-3 text-burgundy" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[10px] leading-5 text-stone">
              By continuing, you agree to our Terms & Conditions and acknowledge our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}