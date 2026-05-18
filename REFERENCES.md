# REFERENCES
Before writing code, read the relevant reference. Match its patterns exactly.

## Controllers — `controllers/home.js`
- One exported function per route action, named after what it does (`getTodos`, `createTodo`)
- Always `try/catch`, always pass errors to `next(err)`

## Models — `models/Todo.js`
- Explicit types + `required` validation on every field
- No business logic — data shape only
- Exception: auth models (`User.js`) may include password hashing hooks and instance methods

## Routes — `routes/main.js`
- Import controller, map HTTP verb + path to controller function
- Middleware goes inline in the route definition: `router.get('/', ensureAuth, controller.fn)`
- No other inline logic — all logic lives in controllers

## Middleware — `middleware/auth.js`
- Single responsibility per function
- Always calls `next()` or redirects — never leaves request hanging

## Views (EJS) — `views/index.ejs`
- Forms → also check `views/login.ejs`
- Dynamic lists → also check `views/todos.ejs`
- No inline `<style>` or `<script>` blocks
- CSS in `/public/css/`, JS in `/public/js/`, linked via `<link rel="stylesheet" href="/css/name.css">`

## CSS
- Base styles, variables, resets → `public/css/global.css` (element selectors ok here)
- Page styles → `public/css/homepage.css` (one file per page, named after it)
- Use section comments (`/* ─── Nav ───── */`) to separate blocks
- Class selectors for components; no IDs; nothing page-specific goes in `global.css`

## Client-side JS — `public/js/main.js`
- Vanilla only (unless library is already in `package.json`)
- Heavy logic in named functions (`deleteTodo`, `markComplete`) — arrow functions ok for event binding only
- One file per page if logic grows, named after the page (`todos.js`)

## Server — `server.js`
- Follow existing `app.use()` pattern when wiring new routes or middleware

## Config — `config/database.js`
- Export a single setup function, called once from `server.js`
