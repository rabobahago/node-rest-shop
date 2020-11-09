const express = require('express')
const router = express.Router()
const multer = require('multer')
const productsController = require('../controllers/products')
const checkAuth = require('../../middleware/check-auth')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname)
  },
})
const fileFilter = (req, file, cb) => {
  if (file.mimeType === 'image/png' || file.mimeType === 'image/jpeg') {
    cb(null, true)
  }
  cb(null, false)
}
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
})

router.get('/', productsController.products_get_all)

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  productsController.products_create_products,
)

router.get('/:productsId', productsController.products_get_one)

router.patch(
  '/:productsId',
  checkAuth,
  productsController.products_edit_products,
)

router.delete(
  '/:productsId',
  checkAuth,
  productsController.products_remove_products,
)
module.exports = router
