const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({ message: 'Mail exists' })
      } else {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            res.status(500).json({
              error: error,
            })
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            })
            user
              .save()
              .then((result) => {
                console.log(result)
                res.status(201).json({
                  message: 'user created successfully',
                })
              })
              .catch((err) => {
                console.log(err)
                res.status(500).json({ error: err })
              })
          }
        })
      }
    })
})
router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        })
      }
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          })
        }
        if (result) {
          const token = jwt.sign(
            { email: users[0].email, userId: users[0]._id },
            process.env.JWT_KEY,
            {
              expiresIn: '1hr',
            },
          )
          return res
            .status(200)
            .json({ message: 'Auth successful', token: token })
        }
        res.status(401).json({ message: 'Auth failed' })
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})
router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({ message: 'user deleted' })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})
module.exports = router
