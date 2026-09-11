# EcoWear Sportswear Store — React + Firebase E-commerce Template

> **Production-ready eco sportswear storefront** built by the [Baloch Dev Team](https://www.balochdev.com). React 19, Vite 7, Firebase Auth & Firestore — clone, configure, and launch your sportswear brand online.

[![BalochDev](https://img.shields.io/badge/Built%20by-Baloch%20Dev%20Team-0ea5e9?style=flat-square)](https://www.balochdev.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Keywords:** React sportswear e-commerce template, Firebase clothing store, Vite React shop starter, eco fashion website, admin dashboard Firebase, open source e-commerce template

**Repository:** [BalochDevOrg/ecowear-sportswear-react-firebase](https://github.com/BalochDevOrg/ecowear-sportswear-react-firebase) · **Agency:** [balochdev.com](https://www.balochdev.com) · **Contact:** [team@balochdev.com](mailto:team@balochdev.com)

---

EcoWear is a fictional **eco-conscious sportswear** brand. This repository is a **production-ready demo** storefront with a **Firebase-backed order pipeline** and an **admin cockpit** that stays visually separated from the shopper experience.

---

## 1. Technology stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Front-end | React 19 (`react`, `react-dom`) | Component model, hooks, Suspense-friendly |
| Tooling | Vite 7 | Dev server, optimised production bundles |
| Routing | `react-router-dom` 7 | Nested routes, protected areas, admin namespace |
| Backend | Firebase Authentication + Cloud Firestore | No custom Node server in this repo |
| Styling | Modular CSS (`src/styles/responsive.css`) + existing page classes | Matches existing emerald / dark theme |
| Hosting (optional) | Firebase Hosting | SPA rewrites declared in `firebase.json` (`dist/`) |

Supported browser matrix: evergreen Chromium / Firefox / Safari — uses modern ES modules only.

---

## 2. Local development

### Requirements

- Node.js **18+** (Vite recommendation)
- Firebase project **with Email/Password Authentication enabled**

### Environment variables (`/.env`)

Create `.env` (copy from `.env.example`) — Vite prefixes every key with **`VITE_`**:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Restart `npm run dev` whenever env keys change.

### Commands

```
npm install
npm run dev      # launches Vite (default http://localhost:5173)
npm run lint
npm run build    # artefacts land in ./dist
npm run preview  # smoke-test prod build locally
```

### Deploy Firestore artefacts (optional CLI)

```
npm install -g firebase-tools        # once per machine
firebase login
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only hosting      # requires prior npm run build
```

---

## 3. Roles & onboarding

### Customer accounts

`/register` always writes `users/{uid}.role = "customer"` via `AuthContext`. Firestore Security Rules disallow privilege escalation during self-signup.

### Admin accounts (**manual uplift**)

Firestore rules trust `users/{uid}.role === "admin"`. Elevate privileged staff **manually**:

1. Create the staff account through `/register` (or Firebase Auth console → Add user).
2. Open Firebase console → Firestore → `users` collection → `{uid}` document.
3. Set `role` field to **`admin`** (string).
4. Re-login (`/login`) — navigation routes to `/admin`.

> **Teaching note**: production apps usually promote admins with Custom Claims (`setCustomUserClaims`) or a Cloud Function audited workflow. Manual Firestore editing is intentional for coursework transparency.

---

## 4. Information architecture — Customer vs Admin

| Concern | Public URL roots | Behaviour |
| --- | --- | --- |
| Consumer shell | `/`, `/shop`, `/cart`, `/product/:id`, `/login`, `/register` | Wrapped by `ClientLayout` + storefront `Navbar` |
| Protected shopper flows | `/checkout`, `/profile` | Guarded by `ProtectedRoute` (requires Firebase Auth session) |
| Post-checkout receipt | `/success/:orderId` | Read-only reassurance screen (Firestore order referenced by URL id) |
| Staff cockpit | `/admin/*` | `AdminLayout` — dedicated sidebar/back-to-store UX, rejects non-admin users |

### Reference order flow (client)

1. Browse `/shop`, optional category filter sourced from **`categories`** collection.
2. Open `/product/:id`, configure size/color, add rows to ephemeral **React cart context**.
3. Visit `/cart` → `/checkout` (forces login gate).
4. Submit checkout → persists Firestore **`orders`** document + clears cart locally.
5. `/success/:orderId` acknowledgement + shopper may revisit **`/profile`** for history.

```
Shop → PDP → Cart → Login (if cold) → Checkout → Firestore.orders → Success page → Profile history
```

### Admin workflows

1. **Dashboard** aggregates counts + optional seed packs (taxonomy + demo SKUs).
2. **Orders** backlog → drill into granular workspace (`/admin/orders/:orderId`).
3. **Products** CRUD (+ edit route) persists catalogue nodes.
4. **Categories** CRUD informs storefront taxonomy filter chips.

---

## 5. Firestore collections (diagram-friendly reference)

Legend for field tables:

| Type | Meaning |
| --- | --- |
| `timestamp` | `serverTimestamp()` (stored as Firestore Timestamp) |
| `string \| number \| bool` | scalar JSON |
| `map` | Nested object literal |
| `array` | List of heterogeneous JSON rows |

---

### Collection `users` — path `users/{uid}`

Stores profile + privilege flag.

| Field | Type | Producer | Notes |
| --- | --- | --- | --- |
| `uid` | string | App on register/login | Mirrors Auth UID |
| `name` | string | Register form | Mirrors display name fallback |
| `email` | string | Firebase Auth token | Convenience denormalisation |
| `role` | `"customer" \| "admin"` | Register (customer) then manual uplift | Consumed inside Security Rules |
| `createdAt` | timestamp | Register | Ordering / audits |

Relationships (for diagrams):

- **`users`** `1 ──<` **`orders`** (via `orders.userId` foreign key analogy).

---

### Collection `categories` — path `categories/{categoryId}`

Merchandising taxonomy driving filters + admin SKU assignment.

| Field | Type | Producer | Notes |
| --- | --- | --- | --- |
| `name` | string | Admin UI | Canonical label |
| `slug` | string | Service (`slugFromName`) | SEO-style token |
| `description` | string | Admin UI | Narrative/help text |
| `createdAt` | timestamp | Admin create | Ordering |

Relationships:

- **`categories`** `<── products.categoryId`** (optional pointer on SKU rows).

---

### Collection `products` — path `products/{productId}`

Eco apparel catalogue surfaced on storefront & admin SKU library.

| Field | Type | Producer | Notes |
| --- | --- | --- | --- |
| `title` | string | Admin SKU form | Headline PDP copy |
| `description` | string | Admin SKU form | Long copy |
| `price` | number | Admin SKU form | GBP in UI (£) |
| `imageUrl` | string | Admin SKU form | Absolute HTTPS thumbnail |
| `sizes` | array\<string\> | Admin SKU form | Comma-split → arrays |
| `colors` | array\<string\> | Admin SKU form | PDP chips |
| `inStock` | bool | Admin toggle | Influences merchandising copy |
| `categoryId` | string \| "" | Admin select | Targets `categories/{id}` when present |
| `categoryName` | string | Admin select/backfill | Denormalised shopper label |
| `category` | string | Legacy seed / migration | Mirrors `categoryName` fallback |
| `createdAt`, `updatedAt` | timestamps | SDK writers | Maintain audit trail |

Diagram tips:

1. ER between **categories** ⇄ **products** (nullable FK analogy).
2. Cart line duplication: checkout copies **SKU snapshot** rows into **`orders.items`**.

---

### Collection `orders` — path `orders/{orderId}`

Operational ledger bridging buyer + fulfilment tooling.

Top-level invoice fields written at checkout (`createOrder`):

| Field | Type | Producer | Notes |
| --- | --- | --- | --- |
| `userId` | string | Checkout | Mirrors Auth UID (`users/{uid}`) |
| `customerName` | string | Checkout | Delivery contact |
| `email` | string | Checkout | Mirrors Auth email snapshot |
| `items` | array\<map\> | Checkout snapshot | Embedded line-items (immutable history) |
| `subtotal` | number | Checkout | Derived from cart reducer |
| `shipping` | number | Checkout logic | Threshold-based promo (£80 free threshold) |
| `total` | number | Checkout | Derived |
| `shippingAddress` | map | Checkout HTML form fields | Persisted verbatim |
| `status` | `"pending" \| …` enum style string | Starts `pending`; admin adjusts | Mirrors operational SLAs |
| `createdAt`, `updatedAt` | timestamps | SDK | Sorting timelines |
| `adminRead` | bool | Starts `false`; admin drill-down flips true | Lightweight “notifications” |

#### Embedded `orders.items[*]` snapshot shape (typical cart line item)

These fields power both checkout summary + QA in admin tooling:

| Sub-field | Type | Notes |
| --- | --- | --- |
| `id` | string | Parent product Firestore doc id |
| `title` | string | SKU title duplicated at checkout time |
| `price` | number | GBP unit price duplicated |
| `quantity` | number | PDP/cart qty |
| `size` | string | PDP selection |
| `color` | string | PDP selection |
| `imageUrl` | string \| optional | Carried forward if present |

> **Teaching note**: pricing is recomputed entirely on the shopper device (trusted-client model acceptable for demos). Industrial systems re-price items with Cloud Functions and signed server totals.

Operational status vocabulary (recommended uniform strings):

```
pending → processing → shipped → delivered | cancelled
```

Relationships for diagrams:

- **`orders.userId`** points to **`users/{uid}`** (Firestore path pattern).
- **Cart context** disappears after browser refresh — only persisted artefacts are **`orders`** rows.

---

## 6. Security rules snapshot

Authoritative definition: **`firestore.rules`** at the repo root (same grammar as the Firebase Console **Rules** tab).

### Repo file vs Firebase Console — do you need both?

You only need rules **applied once on the Firebase backend**:

| Approach | What to do |
| --- | --- |
| **CLI (recommended for this repo)** | From this folder run `firebase deploy --only firestore:rules`. Keep `firestore.rules` in Git as the canonical copy. |
| **Console only** | Open Firebase Console → **Firestore Database** → **Rules**, paste the full contents of `firestore.rules`, click **Publish**. |

Keeping **two different** versions (edited only in Console *and* only in Git) causes confusion. Prefer: edit **`firestore.rules` here**, then deploy or paste so Cloud and repo match.

Effective behaviour (aligned with EcoWear UI):

| Path | Anonymous | Signed-in customer | Admin (`users/{uid}.role == "admin"`) |
| --- | --- | --- | --- |
| `products/*` | read | read | full catalog CRUD |
| `categories/*` | read | read | full taxonomy CRUD |
| `orders/*` | no access | create own checkout doc (`status == pending`) with validated fields; read own orders | read/update **all** orders |
| `users/*` | no access | **create** own profile with `role == "customer"` only; **read**/update **own** doc **without changing `role`** | read/write any (`role` uplift for staff here) |
| **Any other collection** | denied (catch‑all `/{document=**}` rule) |

Apply after edits:

```
firebase deploy --only firestore:rules
```

---

## 7. Indexing catalogue

Firestore composite queries require explicit configs. Repo ships **`firestore.indexes.json`** with:

```
Collection: orders
Fields: userId ASC, createdAt DESC
Purpose: shopper profile chronological history (`getOrdersByUser`)
Deploy: firebase deploy --only firestore:indexes
```

If Firebase console reports another missing composite (rare unless you customise queries), use the hyperlink in the error banner to mint the JSON addition.

---

## 8. Notifications & email realism

Current implementation (**intentionally simple**):

- **No SMTP / transactional email pipeline** bundled.
- Operational awareness comes from **`adminRead` boolean** + realtime listener on Orders dashboard (Firestore snapshot).
- Shoppers revisit **`/profile`** for canonical order status synced from Admin updates.

**Extension ideas** suitable for coursework “future work” bullets:

| Pattern | Complexity | Fits diagrams |
| --- | --- | --- |
| Firebase Extension “Trigger Email” + Firestore-written mail queue | Medium | Shows event-driven messaging |
| Cloud Function `onCreate(/orders)` → Twilio SMS / Mailgun REST | Higher | Fits sequence diagrams |
| Web push / Firebase Cloud Messaging for admin PWA alerts | Higher | Mobile alerting layer |

Diagram suggestion pack (5 artefacts):

1. **Context diagram**: Browser ↔ Firebase Auth / Firestore / (optional Hosting CDN).
2. **Component diagram**: React Router shells (`ClientLayout` vs `AdminLayout`) interacting with Firebase SDK layers.
3. **ER diagram**: Entities `users`, `categories`, `products`, `orders` + embedded line-items.
4. **Sequence**: Checkout → Auth session → Transactional Firestore writes → Profile refresh loops.
5. **State workflow**: Operational status transitions with swimlanes `{Customer, FulfillmentStaff, Database}`.

---

## 9. Seed data utilities (admins only)

`/admin` dashboard exposes:

- **`seedDefaultCategories()`** → ensures core taxonomy buckets (skips duplicates by name casing).
- **`seedProducts()`** → publishes three representative SKUs referencing legacy textual categories.

Treat these as disposable demo utilities — rerun only in clean sandboxes.

---

## 10. Operational checklist before screenshots

| Step | Action |
| --- | --- |
| 1 | Populate `.env` with Firebase credentials |
| 2 | Deploy / emulate Firestore rules + indexes (`firebase deploy --only firestore`) |
| 3 | Elevate exactly one UID to `role: admin` |
| 4 | Seed categories/products (dashboard buttons) optional |
| 5 | Exercise golden path cart → checkout → fulfilment tweak → shopper profile reconciliation |

Happy reporting — regenerate diagrams referencing section **5** for authoritative field nomenclature.
