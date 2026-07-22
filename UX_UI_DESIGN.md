# M-Pesa POS App UX & UI Design

## 1. Product Goal
The product should feel fast, trustworthy, and low-friction for a cashier or merchant completing payments in a busy retail setting.

## 2. Primary Users
- Cashier: Needs fast payment entry, clear status feedback, and minimal taps.
- Merchant owner: Needs transaction visibility, reports, and configuration control.
- Support/admin: Needs error visibility and system health monitoring.

## 3. Core User Journey
1. Open the POS app.
2. Select Quick Pay.
3. Enter phone number and amount.
4. Review transaction summary.
5. Submit STK push request.
6. Receive success, pending, or failed feedback.
7. View transaction history or retry if needed.

## 4. Information Architecture
- Home / Quick Pay
  - Phone number input
  - Amount input
  - Pay button
  - Last transaction status
- Transactions
  - Recent payments
  - Filter by date and status
  - Retry or view details
- Reports
  - Daily sales summaries
  - Success rate
  - Failed transactions
- Settings
  - Merchant profile
  - Callback URL and environment config
  - Notifications and security

## 5. Screen Flow
- Splash / login screen
- Dashboard / quick pay screen
- Payment confirmation screen
- Success / pending / error state screen
- Transaction detail screen
- Reports screen
- Settings screen

## 6. UX Principles
- One-tap action path for payment submission.
- Large, high-contrast call-to-action buttons.
- Use clear status messages: Success, Pending, Failed.
- Show validation errors inline before submission.
- Support keyboard-first input for POS hardware and tablets.
- Keep critical actions visible without clutter.

## 7. Visual Design Direction
- Primary color: M-Pesa green (#00A651)
- Secondary color: deep charcoal (#0F172A)
- Accent: warm amber (#F59E0B) for warnings
- Typography: Inter or Poppins for a modern, clean feeling
- Components: rounded cards, elevated panels, subtle shadows, strong spacing

## 8. UI Component Patterns
- Input fields with large touch targets
- Summary card showing amount, phone, and request status
- Badge chips for status states
- Sticky bottom action bar on small screens
- Empty-state panels for no transactions yet

## 9. Accessibility & Responsiveness
- High contrast text and button states
- Screen-reader-friendly labels and status announcements
- Responsive layout for mobile, tablet, and kiosk displays
- Avoid long forms; keep essential actions above the fold

## 10. Proposed Dashboard Layout
- Left sidebar for navigation on desktop
- Top bar with merchant name, connection status, and help
- Main content area with:
  - Quick payment card
  - Today’s summary tiles
  - Recent transactions list

## 11. Suggested Content Copy
- Pay Now
- Enter phone number
- Enter amount
- Confirm payment
- Transaction pending
- Payment successful
- Payment failed. Try again.

## 12. Next Step
Use this structure as a starting point for a frontend implementation in React, Next.js, or a lightweight web app shell.
