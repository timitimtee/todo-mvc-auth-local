const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String },
  displayName: { type: String },
  firstName: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  userName: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: String,
  user_location: { type: String },
  // Saved delivery addresses. Embedded array (same pattern as user_cart) so
  // each entry gets its own _id for edit/delete. Absent until the first
  // $push — new users (incl. Google sign-ups) need no special handling.
  user_locations: [
    { address: { type: String, required: true }, comment: { type: String } },
  ],
  user_cart: [{ item_id: { type: String }, quantity: { type: Number } }],
  user_credit_card_number: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb,
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
