const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'handling GET require to /products' })
})

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  })
  product
    .save()
    .then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })
  res.status(201).json({
    message: 'handling POST require to /products',
    createdProduct: product,
  })
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
