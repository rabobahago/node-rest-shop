const order = require('../models/order')
exports.orders_get_all = (req, res, next) => {
  order
    .find()
    .select('quantity product _id')
    .populate('product', 'name')
    .find()
    .exec()
    .then((results) => {
      res.status(200).json({
        count: results.length,
        orders: results.map((result) => {
          return {
            _id: result._id,
            quantity: result.quantity,
            product: result.product,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders' + result._id,
            },
          }
        }),
      })
    })
    .catch((error) => {
      res.status(500).json({ error: error })
    })
}
exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'product not found' })
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      })
      return order.save()
    })
    .then((result) => {
      console.log(result)
      res.status(201).json({
        message: 'Order Stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: 'GET',
          url: 'https://localhost/3000/order' + result._id,
        },
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.orders_get_one = (req, res, next) => {
  const id = req.params.orderId
  order
    .findById(id)
    .populate('product')
    .exec()
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: 'Order not found ' })
      }
      res.status(200).json({
        doc: doc,
        request: {
          type: 'GET',
          url: 'http://localhost/3000/orders',
        },
      })
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
}
exports.orders_remove_order = (req, res, next) => {
  order
    .remove({ _id: req.params.orderId })
    .exec()
    .then(
      res.status(200).json({
        message: 'order successfully removed',
        request: {
          type: 'POST',
          url: 'http://localhost/3000/orders',
          body: { productId: 'ID', quantity: 'Number' },
        },
      }),
    )
    .catch((error) => {
      res.status(500).json({ error: error })
    })
}
