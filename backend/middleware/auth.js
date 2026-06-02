module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.status(401).json({ error: 'Unauthorized' })
    }
  },
  ensureAdmin: function (req, res, next) {
    if (req.user && req.user.role === 'admin') {
      return next()
    } else {
      res.status(403).json({ error: 'Forbidden' })
    }
  },
}
