const MenuItem = require('../models/MenuItem')
const Order = require('../models/Order')

module.exports = {
  getMenuItems: async (req, res) => {
    try {
      const items = await MenuItem.find()
      res.json(items)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  },

  createMenuItem: async (req, res) => {
    try {
      const item = await MenuItem.create(req.body)
      res.status(201).json(item)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  },

  updateMenuItem: async (req, res) => {
    try {
      const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
      if (!item) return res.status(404).json({ error: 'Not found' })
      res.json(item)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate('user', 'userName email').sort({ createdAt: -1 })
      res.json(orders)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      )
      if (!order) return res.status(404).json({ error: 'Not found' })
      res.json(order)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  },
}
