const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        item_id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)
