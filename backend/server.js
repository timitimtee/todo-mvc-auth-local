const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const logger = require('morgan')
const path = require('path')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')
const adminRoutes = require('./routes/admin')

require('dotenv').config({ path: path.join(__dirname, 'config/.env') })

require('./config/passport')(passport)

connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use('/api', mainRoutes)
app.use('/api/todos', todoRoutes)
app.use('/api/admin', adminRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'))
  })
}

app.listen(process.env.PORT, () => {
  console.log('Server is running, you better catch it!')
})
