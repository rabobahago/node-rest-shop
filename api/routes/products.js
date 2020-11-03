const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then((result) => {
      console.log(result)
      const response = {
        name: result.length,
        products: result.map((doc) => ({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + doc._id,
          },
        })),
      }
      res.status(200).json({
        message: 'Successfully get all the products',
        product: response,
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
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products' + result._id,
          },
        },
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
    .select('name price _id')
    .exec()
    .then((doc) => {
      console.log(doc)
      if (doc) {
        res.status(200).json({
          products: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products' + id,
          },
        })
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
      res.status(200).json({
        message: 'product updated successfully',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products' + id,
        },
      })
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
      res.status(200).json({
        message: 'Product removed successfully',
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json(err)
    })
})
module.exports = router
