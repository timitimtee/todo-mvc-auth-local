# REFERENCES
Before writing code, read the relevant reference. Match its patterns exactly.

## Architecture
Split into two independent layers:
- `frontend/` — Vite + React. Handles all UI and client-side routing via React Router.
- `backend/` — Node + Express. Serves a JSON REST API only. No views, no EJS, no static files in dev.

In production, `server.js` serves the Vite build from `dist/`.

## Backend

### Controllers — `backend/controllers/todos.js`
- One exported function per route action, named after what it does (`getTodos`, `createTodo`)
- Always `try/catch`, log errors, respond with `res.json()`
- `controllers/locations.js` — saved delivery addresses CRUD, same shape as todos but operates on the embedded `req.user.user_locations` array (`$push`/positional `$set`/`$pull`). Returns the updated `{ locations }` list.
- Auth controller (`controllers/auth.js`) uses passport callbacks and returns `{ success: true }` or `{ errors: [...] }`
- `getMe` in `controllers/auth.js` is the "who am I" endpoint: `req.isAuthenticated()` → returns a **whitelisted** user object (never `password` or `user_credit_card_number`), else `401` + `null`

### Models — `backend/models/Todo.js`
- Explicit types + `required` validation on every field
- No business logic — data shape only
- Exception: `User.js` may include password hashing hooks and instance methods
- `User.user_locations` — embedded array of saved delivery addresses `[{ address, comment }]` (same pattern as `user_cart`). Each entry gets a Mongo `_id` used for edit/delete. Distinct from the unused singular `user_location` String.

### Routes — `backend/routes/todos.js`
- Import controller, map HTTP verb + path to controller function
- Auth middleware goes inline: `router.get('/', ensureAuth, controller.fn)`
- No inline logic — all logic lives in controllers
- `routes/main.js` → auth endpoints (`/me`, `/login`, `/logout`, `/signup`), mounted at `/api`
- `routes/todos.js` → todo CRUD endpoints (`/todos/*`)
- `routes/auth.js` → Google OAuth endpoints, mounted at `/auth` (`/auth/google`, `/auth/google/callback`)
- `routes/locations.js` → saved-address CRUD (`GET /`, `POST /addLocation`, `PUT /updateLocation`, `DELETE /deleteLocation`), all `ensureAuth`, mounted at `/api/locations`
- `routes/menuItems.js` → public menu reads, mounted at `/api/menuitems`: `GET /` (all items) and `GET /:id` (one item). `getMenuItem` is used by the item modal so a deep-linked/refreshed `/item/:slug_id` URL can load on its own; a bad/non-existent id (incl. CastError) returns `404`. No auth — the menu is browseable by guests.

### Middleware — `backend/middleware/auth.js`
- Single responsibility per function
- Always calls `next()` or responds with `res.status(401).json(...)` — never leaves request hanging

### Server — `backend/server.js`
- Follow existing `app.use()` pattern when wiring new routes or middleware
- `app.set("trust proxy", 1)` is set near the top — required behind Render's reverse proxy so the `secure` session cookie sets over HTTPS and `req.ip` (used by the auth rate-limiter) reads the real client IP. Use `1`, never `true` (spoofable).

### Config — `backend/config/database.js`
- Export single setup function, called once from `server.js`
- Passport config in `backend/config/passport.js`
- Env vars in `backend/config/.env`; required-var checklist (no secrets) in repo-root `.env.example`
- `BASE_URL` (prod: `https://<app>.onrender.com`, no trailing slash) drives the Google OAuth `callbackURL` in `passport.js`; falls back to `http://localhost:${PORT}` in dev

## Frontend

### Entry — `frontend/src/main.jsx`
- Mounts `<App />` to `#root`

### Routing — `frontend/src/App.jsx`
- All client-side routes defined here with React Router `<Routes>` / `<Route>`
- These are UI routes only — separate from Express API routes
- **Modal-as-a-route** (`backgroundLocation` pattern): the item modal has its own URL `/item/:itemParam` so it's deep-linkable and the Back button closes it. `AppRoutes()` reads `location.state?.backgroundLocation`; when present (set by a menu card click) the main `<Routes>` renders using that stashed location (menu stays mounted) and a second `<Routes>` renders `ItemModal` on top. On a direct visit/refresh of `/item/...` there is no background, so the main `<Routes>` matches `/item/...` itself and the fullscreen modal shows alone. `:itemParam` = `slug_id`; only the trailing `_id` is used to fetch (slug is cosmetic). Docs term: "react router modal backgroundLocation".
- App is wrapped `UserProvider` → `CartProvider` → routes.

### Components — `frontend/src/components/`
- One file per page/feature
- Fetch data from Express API using `fetch()` calls to backend endpoints
- Handle auth state via API responses (redirect on 401, etc.)
- `AuthForm/AuthForm.jsx` (`pages/AuthForm/`) — shared local-auth card used by BOTH `/login` and `/signup` routes (`App.jsx` passes `initialMode`). Top tabs flip an internal `mode` state (`login`/`signup`) in place, no navigation. Login uses `UserContext.login()` (so context refreshes); signup POSTs `/api/signup` then `refreshUser()`. Both redirect to `/` on success. Conditional fields: login = email+password, signup = +userName +confirmPassword. Styling in `auth.css` (mobile-first card, `.auth-tabs`, `.auth-divider`); reuses `Logo` + `GoogleSignInButton`.
- `Manage.jsx` (`pages/Manage.jsx`) — admin dashboard at `/manage` (tabs: Menu Items, Orders). Calls admin-only API: `GET/POST /api/admin/menu-items`, `PUT /api/admin/menu-items/:id`, `PUT /api/admin/orders/:id/status`. The add form and inline edit form both build the item from a `.map()` over field names; `menu_item_image` is pulled out of that map and handled by `UploadWidget` + a preview square (`imagePreview()`). `parsePrice()` coerces the price to a finite Number before send (empty/garbage → inline `formError`, never ships `NaN` which JSON serialises to `null` → Mongoose "price required" 500). `error` = full-page (auth/403); `formError` = inline form validation.
- `UploadWidget/` — reusable Cloudinary **unsigned** Upload Widget button. Loads `window.cloudinary` (script tag in `frontend/index.html`), reads `VITE_CLOUDINARY_CLOUD_NAME`/`VITE_CLOUDINARY_UPLOAD_PRESET` from `frontend/.env` (preset must be set to *Unsigned* in the Cloudinary dashboard or uploads 401). Builds the widget **once** on mount and calls `onUploadSuccess(result.info)`; parent stores `result.info.secure_url` (a full `https://res.cloudinary.com/...` URL) straight into `menu_item_image` — the field stays a `String`, so **no backend/model change** is needed and the existing `<img src={item.menu_item_image}>` in `MenuItems.jsx` just works. **Gotcha:** because the widget is built once, its success callback freezes the props from first render — parents MUST update state with the functional form `setX(prev => ({ ...prev, menu_item_image: info.secure_url }))`, never `setX({ ...x, ... })`, or the captured stale snapshot wipes other typed fields.
- `DeliveryPickupPill/` — delivery vs pickup toggle + the location/time selection rows. Owns the order-timing state `{ mode, date, time }` and renders the time row text from it.
  - `OrderTimingModal/` — controlled center modal (overlay) for choosing ASAP vs Schedule-for-later (+ Date/Time `<select>`s). Parent passes `value` and gets the new selection via `onConfirm`; Cancel/overlay click discards the draft. `ASAP_MINUTES` and the date/time option lists are hardcoded with `TODO(backend)` — meant to come from the admin dashboard later.
  - `DeliveryAddressModal/` — controlled center modal (same shell as OrderTimingModal) opened by clicking the location row when Delivery is selected. Reuses `SearchLocations` for the address search. Two views: **browse** (search + saved-address list when logged in, or sign-in prompt when logged out) and **confirm** (address + "Additional details" → the single `comment` field). Persists via `/api/locations` when logged in, else `localStorage` key `deliveryAddress`. Hands the chosen `{ address, comment }` up via `onConfirm`; the pill shows it as "Delivery to …". On load the pill seeds the active address from the first `/api/locations` entry (logged in) or localStorage (logged out).

#### Cart & item-ordering UI (all read `useCart`)
- `MenuItems/MenuItems.jsx` — menu list at `/`. The **whole `<li>` is clickable** → `navigate('/item/<slug>_<id>', { state:{ backgroundLocation: location } })` (opens the modal over the menu). `slugify()` makes the cosmetic slug from the name. No inline add button anymore.
- `ItemModal/` — fullscreen item modal (route `/item/:itemParam`). Parses the id from after the last `_`, fetches `GET /api/menuitems/:id`. Shows image → name → price → description → "Customize your item" → **Extras** (from `EXTRAS`). Each extra row toggles between a `+` (add) and `[trash] qty [+]`. Sticky footer "Add to Cart $total" (`item price + Σ extra.price*qty`). On add → `addItem()` then `navigate('/', { replace:true })` (drops the modal from history so Back won't reopen it); X/Back closes via `backgroundLocation` (else `/`). Per-item state resets on id change so nothing leaks between items.
- `AddedModal/` — bottom-sheet "N item(s) added" shown on `/` when `lastAddCount > 0`. "View cart" → `clearLastAdded()` + `openDrawer()`; "Back to menu" → `clearLastAdded()`.
- `ViewOrderButton/` — fixed bottom pill, **only renders when `count > 0`**, label "View order — $total [count]", opens the drawer. Rendered by `Homepage`, which also renders a `.view-order-spacer` (88px, only when `count > 0`) so the fixed pill never covers the last menu row.
- `ShoppingCart/ShoppingCart.jsx` — Nav cart icon; reads `count` + `openDrawer` from `useCart` (no props), renders `<CartDrawer />`.
  - `CartDrawer/CartDrawer.jsx` — slide-in panel driven by `drawerOpen`/`closeDrawer`. Empty → "Add items to start your order"; else lists lines (image, name, extras text, line price, `[trash] qty [+]`) + Subtotal / Tax / **Checkout** (stub `onClick` — real flow is a later task).

### State / Auth context — `frontend/src/contexts/UserContext.jsx`
- `UserProvider` is the single source of truth for "who is logged in". Wraps the app in `App.jsx`.
- Holds three states: `loading` (true until first `/api/me` resolves), `user` object (logged in), or `null` (logged out)
- On mount, a `useEffect` calls `refreshUser()` → `fetch("/api/me")`. This is the **frontend equivalent of `ensureAuth`** — it asks the backend who the surviving session cookie belongs to. Covers page load, refresh, and return-from-Google-redirect.
- Exposes: `user`, `loading`, `login(email,password)`, `logout()`, `refreshUser()`
- `refreshUser()` = manual re-check, called after any login that happens **after** mount (e.g. the signup form) since the on-mount `useEffect` does not re-run on client-side navigation
- No `register()` — the signup path POSTs to `/api/signup` itself, then calls `refreshUser()` before navigating

### Cart state — `frontend/src/contexts/CartContext.jsx`
- **Single source of truth for the cart**, mirrors the `UserContext` shape. Lives **entirely client-side** (React state + `localStorage`) so it works for guests AND logged-in users — login only affects saved addresses, NOT the cart. Order history is saved later, at checkout (not built yet).
- localStorage key `cart` stores `{ v: CART_VERSION, items }` (currently `v:1`). On load a saved cart is **discarded if `v` doesn't match** — bump `CART_VERSION` whenever the line shape changes so a stale shape never reaches the renderer. `unitPrice`/`lineSignature` also guard a missing `extras`.
- ⚠️ `subtotal`/`tax`/`total` are computed **client-side from localStorage** → tamperable. `TODO(checkout)` (in the file): the checkout endpoint MUST re-fetch prices by `menuItemId`, recompute extras + tax server-side in integer cents, and ignore client amounts.
- Line shape: `{ lineId, menuItemId, name, image, price, qty, extras:[{name,price,qty}] }`. `lineId` = a signature of `menuItemId` + sorted extras, so adding the exact same item+extras **merges** (qty++); different extras = separate line.
- Exposes: `items`, derived `count`/`subtotal`/`tax`/`total`, `unitPrice(line)`, `addItem(line, qty=1)`, `incrementLine(id)`, `removeLine(id)` (no minus — trash removes the whole line, matching the reference UI), drawer state `drawerOpen`/`openDrawer()`/`closeDrawer()`, and `lastAddCount`/`clearLastAdded()` (drives the "added" modal).
- `cart/constants.js` — `EXTRAS` (hardcoded placeholder list shown for every item; `TODO(backend)` → per-item admin-managed later) and `TAX_RATE` (hardcoded; `TODO(backend)` like `ASAP_MINUTES`).
- Read it via the `useCart` hook, never `useContext` directly.

### Hooks — `frontend/src/hooks/`
- `useUser.jsx` — thin `useContext(UserContext)` wrapper; throws if used outside `UserProvider`. Components read auth state via this, never `useContext` directly.
- `useCart.jsx` — same pattern for `CartContext`; throws outside `CartProvider`.

### Auth networking
- Frontend uses **relative** fetch paths (`fetch("/api/me")`), never absolute (`http://localhost:2121/...`). The Vite dev proxy (`vite.config.js` → `server.proxy`) forwards `/api` and `/auth` to the backend, so the browser stays same-origin and the session cookie attaches automatically — no CORS needed.

### Styles — `frontend/public/css/` or co-located in components
- No global `/public/css/` on the backend
