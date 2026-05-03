/**
 * Lemon Squeezy checkout configuration
 *
 * 👉 PASTE YOUR LEMON SQUEEZY CHECKOUT URL BELOW.
 *
 * How to find it:
 *   1. Go to https://app.lemonsqueezy.com → Products
 *   2. Click your Vault product → click a variant → "Share" → copy "Checkout URL"
 *   3. Paste it as `monthly` (or `annual`, or `default` if you only have one)
 *
 * If you only have ONE product/variant, just fill in `default` and leave the others empty —
 * the same URL will be used for both plans. Lemon Squeezy will let the customer pick.
 *
 * URLs look like: https://YOURSTORE.lemonsqueezy.com/buy/abc-123-def-456
 */
export const LEMONSQUEEZY_CHECKOUT = {
  default: 'https://checkout.emberworld.co/checkout/buy/d93985c6-4550-4d51-80de-35d6fce07aa2',
  monthly: '',  // ← optional: separate URL for the monthly variant
  annual:  '',  // ← optional: separate URL for the annual variant
};

export function getCheckoutUrl(plan: 'monthly' | 'annual'): string | undefined {
  // 1. Explicit per-plan URL wins
  const direct = LEMONSQUEEZY_CHECKOUT[plan];
  if (direct) return direct;

  // 2. Fall back to default for both plans
  if (LEMONSQUEEZY_CHECKOUT.default) return LEMONSQUEEZY_CHECKOUT.default;

  // 3. Last resort: env vars (build-time only)
  const env = plan === 'monthly'
    ? import.meta.env.VITE_LS_MONTHLY_URL
    : import.meta.env.VITE_LS_ANNUAL_URL;
  return env || undefined;
}
