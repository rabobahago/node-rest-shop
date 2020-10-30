const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'handling GET require to /products' })
})

router.post('/', (req, res, next) => {
  res.status(200).json({ message: 'handling POST require to /products' })
})

router.get('/:productsId', (req, res, next) => {
  const id = req.params.productsId
  if (id === 'special') {
    res.status(200).json({ message: 'you did discovered the special id', id })
  } else {
    res.status(200).json({ message: 'you passed an Id' })
  }
})

router.patch('/:productsId', (req, res, next) => {
  res.status(200).json({ message: 'updated product!' })
})

router.delete('/:productsId', (req, res, next) => {
  res.status(200).json({ message: 'delete product!' })
})
module.exports = router
