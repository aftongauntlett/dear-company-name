# Ecommerce Playbook

Use this when a client website needs payments, products, orders, or subscriptions.

For small websites, optimize for reliability and low operational overhead first.

## Recommended Default for Small Projects

- Payments: Stripe Checkout
- Catalog source: static JSON or lightweight CMS
- Orders: Stripe webhook events stored in database
- Email: transactional notifications via existing contact stack provider or Stripe receipts

## Decision Guide

1. Few products, no account area: Stripe payment links or Checkout.
2. Small catalog with cart and shipping: Stripe Checkout + cart UI + webhook order sync.
3. Custom discounts, subscriptions, customer portal: Stripe API + customer accounts.
4. Large inventory/ERP sync: evaluate dedicated commerce backend.

## Minimum Architecture

1. Product display pages (can stay static).
2. Cart state (client-side for small stores).
3. Server endpoint to create Checkout session.
4. Webhook endpoint to confirm successful payments.
5. Order persistence and reconciliation logic.

## Security and Reliability Baseline

1. Verify webhook signatures.
2. Use idempotency keys for order creation.
3. Never trust cart totals from client; calculate on server.
4. Store prices in minor units (for example, cents).
5. Log payment event IDs to prevent duplicate fulfillment.

## Suggested Environment Variables

- `STRIPE_SECRET_KEY`
- `PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PUBLIC_SITE_URL`

## Compliance Baseline

1. Publish refund and shipping policies.
2. Confirm tax handling strategy.
3. Confirm email receipt behavior.
4. Add privacy policy and terms links.

## QA Checklist

1. Test successful checkout.
2. Test canceled checkout flow.
3. Test duplicate webhook delivery.
4. Test invalid webhook signature.
5. Test out-of-stock or unavailable product handling.

## Handoff Checklist

1. Client owns Stripe account.
2. Live keys rotated and stored in client-owned hosting env.
3. Webhook endpoints documented.
4. Fulfillment flow documented (manual or automated).
5. Access matrix documented and contractor access removed when done.
