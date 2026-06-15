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

### Middleware — `backend/middleware/auth.js`
- Single responsibility per function
- Always calls `next()` or responds with `res.status(401).json(...)` — never leaves request hanging

### Server — `backend/server.js`
- Follow existing `app.use()` pattern when wiring new routes or middleware

### Config — `backend/config/database.js`
- Export single setup function, called once from `server.js`
- Passport config in `backend/config/passport.js`
- Env vars in `backend/config/.env`

## Frontend

### Entry — `frontend/src/main.jsx`
- Mounts `<App />` to `#root`

### Routing — `frontend/src/App.jsx`
- All client-side routes defined here with React Router `<Routes>` / `<Route>`
- These are UI routes only — separate from Express API routes

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

### State / Auth context — `frontend/src/contexts/UserContext.jsx`
- `UserProvider` is the single source of truth for "who is logged in". Wraps the app in `App.jsx`.
- Holds three states: `loading` (true until first `/api/me` resolves), `user` object (logged in), or `null` (logged out)
- On mount, a `useEffect` calls `refreshUser()` → `fetch("/api/me")`. This is the **frontend equivalent of `ensureAuth`** — it asks the backend who the surviving session cookie belongs to. Covers page load, refresh, and return-from-Google-redirect.
- Exposes: `user`, `loading`, `login(email,password)`, `logout()`, `refreshUser()`
- `refreshUser()` = manual re-check, called after any login that happens **after** mount (e.g. the signup form) since the on-mount `useEffect` does not re-run on client-side navigation
- No `register()` — the signup path POSTs to `/api/signup` itself, then calls `refreshUser()` before navigating

### Hooks — `frontend/src/hooks/`
- `useUser.jsx` — thin `useContext(UserContext)` wrapper; throws if used outside `UserProvider`. Components read auth state via this, never `useContext` directly.

### Auth networking
- Frontend uses **relative** fetch paths (`fetch("/api/me")`), never absolute (`http://localhost:2121/...`). The Vite dev proxy (`vite.config.js` → `server.proxy`) forwards `/api` and `/auth` to the backend, so the browser stays same-origin and the session cookie attaches automatically — no CORS needed.

### Styles — `frontend/public/css/` or co-located in components
- No global `/public/css/` on the backend
