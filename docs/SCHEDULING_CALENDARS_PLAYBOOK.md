# Scheduling and Calendars Playbook

Use this when a client needs appointment booking, event schedules, or calendar sync.

Choose the simplest model that meets operational needs.

## Recommended Default for Small Projects

- Appointment booking: Cal.com or Calendly embed/link
- Public events: static event list + optional Google Calendar/ICS link
- Admin workload: avoid custom scheduling backend unless required

## Decision Guide

1. "Book a call" only: hosted booking link or embed.
2. Public events listing: static/cms event cards + calendar links.
3. Team availability and resource constraints: dedicated scheduling system.
4. Complex multi-step intake + custom rules: custom backend.

## Core Requirements

1. Timezone clarity on every event/slot.
2. Accessible booking UI and keyboard navigation.
3. Confirmation and reminder flow.
4. Clear cancellation/reschedule policy.

## Data Model Baseline (If Custom)

- `events` (title, start_at, end_at, timezone, location, capacity)
- `bookings` (event_id, name, email, status)
- `availability_rules` (weekday, start_time, end_time, timezone)
- `blackout_dates` (date, reason)

## Common Integration Patterns

1. Embed provider widget for speed.
2. Link out to provider booking page for simpler accessibility and maintenance.
3. Add ICS download links for single events.
4. Add webhooks for booking-created and booking-canceled notifications.

## QA Checklist

1. Test timezone display across at least 2 regions.
2. Test booking from mobile and desktop.
3. Test keyboard-only booking path.
4. Test cancellation and reschedule flow.
5. Test full-capacity edge case messaging.

## Handoff Checklist

1. Client owns scheduling provider account.
2. Booking links/widgets documented.
3. Notification templates and sender addresses documented.
4. Calendar ownership and admin access documented.
5. Contractor access removed or downgraded.
