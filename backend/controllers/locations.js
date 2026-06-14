const User = require('../models/User')

// Saved delivery addresses live as an embedded array (user_locations) on the
// logged-in user. Same controller shape as controllers/todos.js: one async fn
// per action, try/catch, log errors, respond with res.json().
module.exports = {
  // req.user is the full user doc loaded by passport's deserializeUser, so the
  // saved list is already in memory — no extra query needed.
  getLocations: async (req, res) => {
    try {
      res.json({ locations: req.user.user_locations })
    } catch (err) {
      console.log(err)
    }
  },

  // $push creates the array on first use, so new users need no special-casing.
  // { new: true } returns the updated doc so we can hand back the fresh list.
  addLocation: async (req, res) => {
    try {
      const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { user_locations: { address: req.body.address, comment: req.body.comment } } },
        { new: true },
      )
      res.json({ locations: updated.user_locations })
    } catch (err) {
      console.log(err)
    }
  },

  // Match the sub-document by its _id, then use the positional $ operator to
  // update that one entry's fields.
  updateLocation: async (req, res) => {
    try {
      const updated = await User.findOneAndUpdate(
        { _id: req.user.id, 'user_locations._id': req.body.id },
        {
          $set: {
            'user_locations.$.address': req.body.address,
            'user_locations.$.comment': req.body.comment,
          },
        },
        { new: true },
      )
      res.json({ locations: updated.user_locations })
    } catch (err) {
      console.log(err)
    }
  },

  // $pull removes the sub-document whose _id matches.
  deleteLocation: async (req, res) => {
    try {
      const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { user_locations: { _id: req.body.id } } },
        { new: true },
      )
      res.json({ locations: updated.user_locations })
    } catch (err) {
      console.log(err)
    }
  },
}
