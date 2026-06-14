const express = require('express')
const router = express.Router()
const locationsController = require('../controllers/locations')
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, locationsController.getLocations)
router.post('/addLocation', ensureAuth, locationsController.addLocation)
router.put('/updateLocation', ensureAuth, locationsController.updateLocation)
router.delete('/deleteLocation', ensureAuth, locationsController.deleteLocation)

module.exports = router
