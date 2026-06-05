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
}
