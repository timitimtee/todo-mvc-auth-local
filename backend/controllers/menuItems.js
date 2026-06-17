const MenuItem = require('../models/MenuItem')

module.exports = {
  getMenuItems: async (req, res) => {
    try {
      const menuItems = await MenuItem.find()
      res.json({ menuItems })
    } catch (err) {
      console.log(err)
    }
  },

  // Single item by id. Used by the item modal so a deep-linked/refreshed
  // /item/:slug_id URL can load on its own (the slug part of the URL is
  // cosmetic — only the trailing _id is used to look the item up).
  getMenuItem: async (req, res) => {
    try {
      const menuItem = await MenuItem.findById(req.params.id)
      if (!menuItem) return res.status(404).json({ error: 'Not found' })
      res.json({ menuItem })
    } catch (err) {
      // A malformed id (not a valid ObjectId) throws a CastError -> treat as 404.
      console.log(err)
      res.status(404).json({ error: 'Not found' })
    }
  },
}
