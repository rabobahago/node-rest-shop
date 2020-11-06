const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

// this is for login details in the terminal
mongoose
  .connect(
    'mongodb+srv://raboyusuf:' +
      process.env.MONGO_ATLAS_PW +
      '@cluster0.ml1qu.mongodb.net/<dbname>?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Connected to database')
  })
  .catch((err) => {
    console.log('Unable to connect to database')
    console.error(err)
  })
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/uploads', express.static('uploads'))
app.use((req, res, next) => {
  const error = new Error('not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
