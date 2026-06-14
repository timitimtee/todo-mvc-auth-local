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
- Auth controller (`controllers/auth.js`) uses passport callbacks and returns `{ success: true }` or `{ errors: [...] }`
- `getMe` in `controllers/auth.js` is the "who am I" endpoint: `req.isAuthenticated()` → returns a **whitelisted** user object (never `password` or `user_credit_card_number`), else `401` + `null`

### Models — `backend/models/Todo.js`
- Explicit types + `required` validation on every field
- No business logic — data shape only
- Exception: `User.js` may include password hashing hooks and instance methods

### Routes — `backend/routes/todos.js`
- Import controller, map HTTP verb + path to controller function
- Auth middleware goes inline: `router.get('/', ensureAuth, controller.fn)`
- No inline logic — all logic lives in controllers
- `routes/main.js` → auth endpoints (`/me`, `/login`, `/logout`, `/signup`), mounted at `/api`
- `routes/todos.js` → todo CRUD endpoints (`/todos/*`)
- `routes/auth.js` → Google OAuth endpoints, mounted at `/auth` (`/auth/google`, `/auth/google/callback`)

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
- `DeliveryPickupPill/` — delivery vs pickup toggle + the location/time selection rows. Owns the order-timing state `{ mode, date, time }` and renders the time row text from it.
  - `OrderTimingModal/` — controlled center modal (overlay) for choosing ASAP vs Schedule-for-later (+ Date/Time `<select>`s). Parent passes `value` and gets the new selection via `onConfirm`; Cancel/overlay click discards the draft. `ASAP_MINUTES` and the date/time option lists are hardcoded with `TODO(backend)` — meant to come from the admin dashboard later.

### State / Auth context — `frontend/src/contexts/UserContext.jsx`
- `UserProvider` is the single source of truth for "who is logged in". Wraps the app in `App.jsx`.
- Holds three states: `loading` (true until first `/api/me` resolves), `user` object (logged in), or `null` (logged out)
- On mount, a `useEffect` calls `refreshUser()` → `fetch("/api/me")`. This is the **frontend equivalent of `ensureAuth`** — it asks the backend who the surviving session cookie belongs to. Covers page load, refresh, and return-from-Google-redirect.
- Exposes: `user`, `loading`, `login(email,password)`, `logout()`, `refreshUser()`
- `refreshUser()` = manual re-check, called after any login that happens **after** mount (e.g. the signup form) since the on-mount `useEffect` does not re-run on client-side navigation
- No `register()` — the Signup component POSTs to `/api/signup` itself, then calls `refreshUser()` before navigating

### Hooks — `frontend/src/hooks/`
- `useUser.jsx` — thin `useContext(UserContext)` wrapper; throws if used outside `UserProvider`. Components read auth state via this, never `useContext` directly.

### Auth networking
- Frontend uses **relative** fetch paths (`fetch("/api/me")`), never absolute (`http://localhost:2121/...`). The Vite dev proxy (`vite.config.js` → `server.proxy`) forwards `/api` and `/auth` to the backend, so the browser stays same-origin and the session cookie attaches automatically — no CORS needed.

### Styles — `frontend/public/css/` or co-located in components
- No global `/public/css/` on the backend
