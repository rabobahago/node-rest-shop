const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then((result) => {
      // if (result.length >= 0) {
      res.status(200).json({
        message: 'Successfully get all the products',
        products: result,
      })
      // } else {
      //   res.status(404).json({ message: 'No entries found' })
      // }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: error })
    })
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
      res.status(201).json({
        message: 'handling POST require to /products',
        createdProduct: result,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
      })
    })
})

router.get('/:productsId', (req, res, next) => {
  const id = req.params.productsId
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc)
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({ message: 'No valid entry found for this id' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

router.patch('/:productsId', (req, res, next) => {
  const id = req.params.productsId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result)
      res.status(200).json({ result })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ error: error })
    })
})

router.delete('/:productsId', (req, res, next) => {
  const id = req.params.productsId
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})
module.exports = router
