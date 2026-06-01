/**
 * Lemon Squeezy checkout configuration.
 *
 * Lemon Squeezy is a Merchant of Record: it collects the payment, handles all
 * VAT/sales-tax and invoicing, and pays Ember out — so no registered business
 * or KVK number is required to sell. The checkout opens as an OVERLAY on top of
 * emberworld.co (no redirect to another page) via the lemon.js SDK loaded in
 * index.html.
 *
 * 👉 These are the live product/variant checkout URLs from
 *    app.lemonsqueezy.com → Products → Vault → variant → "Share" → Checkout URL.
 *    If the variant IDs ever change, update them here.
 *
 * IMPORTANT (dashboard, not code):
 *   • Remove the 7-day free trial on each variant (Products → variant → no trial).
 *   • Activate the store for live payments so it's not stuck in "test mode".
 */
export const LEMONSQUEEZY_CHECKOUT = {
  default: 'https://checkout.emberworld.co/checkout/buy/d93985c6-4550-4d51-80de-35d6fce07aa2',
  monthly: 'https://checkout.emberworld.co/checkout/buy/d93985c6-4550-4d51-80de-35d6fce07aa2?variant=1608126',
  annual:  'https://checkout.emberworld.co/checkout/buy/d93985c6-4550-4d51-80de-35d6fce07aa2?variant=1608155',
};

export function getCheckoutUrl(plan: 'monthly' | 'annual'): string | undefined {
  // 1. Explicit per-plan URL wins.
  const direct = LEMONSQUEEZY_CHECKOUT[plan];
  if (direct) return direct;

  // 2. Fall back to the default for both plans.
  if (LEMONSQUEEZY_CHECKOUT.default) return LEMONSQUEEZY_CHECKOUT.default;

  // 3. Last resort: build-time env vars.
  const env = plan === 'monthly'
    ? import.meta.env.VITE_LS_MONTHLY_URL
    : import.meta.env.VITE_LS_ANNUAL_URL;
  return env || undefined;
}
