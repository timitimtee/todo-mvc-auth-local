const mongoose = require('mongoose')

const MenuItemSchema = new mongoose.Schema({
  menu_item_category: {
    type: String,
    required: true,
  },
  menu_item_name: {
    type: String,
    required: true,
  },
  menu_item_description: {
    type: String,
    required: true,
  },
  menu_item_price: {
    type: Number,
    required: true,
  },
  menu_item_image: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('MenuItem', MenuItemSchema)
