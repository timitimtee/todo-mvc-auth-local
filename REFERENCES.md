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

### Models — `backend/models/Todo.js`
- Explicit types + `required` validation on every field
- No business logic — data shape only
- Exception: `User.js` may include password hashing hooks and instance methods

### Routes — `backend/routes/todos.js`
- Import controller, map HTTP verb + path to controller function
- Auth middleware goes inline: `router.get('/', ensureAuth, controller.fn)`
- No inline logic — all logic lives in controllers
- `routes/main.js` → auth endpoints (`/login`, `/logout`, `/signup`)
- `routes/todos.js` → todo CRUD endpoints (`/todos/*`)

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

### Styles — `frontend/public/css/` or co-located in components
- No global `/public/css/` on the backend
