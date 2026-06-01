/**
 * Loads Stripe.js from the official CDN on demand and returns a Stripe instance.
 * No npm dependency — keeps the bundle lean and always uses the latest Stripe.js.
 *
 * Set VITE_STRIPE_PUBLISHABLE_KEY in your environment (Vercel → Settings → Env).
 * Use a pk_test_… key while testing; swap to pk_live_… once your Stripe account
 * is activated. The checkout works immediately with test keys.
 */

export const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

// Amounts charged on the first payment, in the smallest currency unit (cents).
export const PLAN_AMOUNTS = { monthly: 1500, annual: 9900 } as const;
export const PLAN_CURRENCY = 'eur';

// Minimal typing — we only touch a handful of methods.
export type StripeLike = {
  elements: (opts: Record<string, unknown>) => StripeElements;
  confirmPayment: (opts: Record<string, unknown>) => Promise<{ error?: { message?: string } }>;
};
export type StripeElements = {
  create: (type: string, opts?: Record<string, unknown>) => StripeElement;
  update: (opts: Record<string, unknown>) => void;
  submit: () => Promise<{ error?: { message?: string } }>;
};
export type StripeElement = {
  mount: (el: HTMLElement | string) => void;
  unmount: () => void;
  on: (event: string, handler: (e: unknown) => void) => void;
};

declare global {
  interface Window {
    Stripe?: (key: string, opts?: Record<string, unknown>) => StripeLike;
  }
}

let stripePromise: Promise<StripeLike | null> | null = null;

export function loadStripe(): Promise<StripeLike | null> {
  const key = STRIPE_PK;
  if (!key) return Promise.resolve(null);
  if (stripePromise) return stripePromise;

  stripePromise = new Promise(resolve => {
    if (typeof window === 'undefined') return resolve(null);
    const finish = () => resolve(window.Stripe ? window.Stripe(key) : null);
    if (window.Stripe) return finish();

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://js.stripe.com/v3/"]');
    if (existing) {
      existing.addEventListener('load', finish);
      existing.addEventListener('error', () => resolve(null));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://js.stripe.com/v3/';
    s.async = true;
    s.onload = finish;
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return stripePromise;
}
