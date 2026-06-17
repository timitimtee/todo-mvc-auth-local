const express = require('express')
const router = express.Router()
const menuItemsController = require('../controllers/menuItems')

router.get('/', menuItemsController.getMenuItems)
router.get('/:id', menuItemsController.getMenuItem)

module.exports = router
