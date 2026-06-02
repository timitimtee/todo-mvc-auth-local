const mongoose = require('mongoose')

const SettingSchema = new mongoose.Schema({
  setting_type: {
    type: String,
    required: true,
  },
  setting_value: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Setting', SettingSchema)
