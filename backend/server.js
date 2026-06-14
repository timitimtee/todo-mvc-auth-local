const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const logger = require("morgan");
const path = require("path");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const todoRoutes = require("./routes/todos");
const locationRoutes = require("./routes/locations");
const adminRoutes = require("./routes/admin");
const menuItemRoutes = require("./routes/menuItems");
const authRoutes = require("./routes/auth");

require("dotenv").config({ path: path.join(__dirname, "config/.env") });

require("./config/passport")(passport);

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      httpOnly: true, // JS can't read the cookie -> blocks XSS cookie theft
      secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
      sameSite: "lax", // blocks cross-site POST/PUT/DELETE -> CSRF hardening
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", mainRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/menuitems", menuItemRoutes);
app.use("/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  });
}

app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
