const express = require('express');
const router = express.Router();
const {
  getOrderById,
  getOrderByUser,
  addOrder,
  createPaymentIntent,
} = require('../controller/customersOrderController');

//add a order
router.post('/add', addOrder);

// create stripe payment intent
// router.post('/create-payment-intent', createPaymentIntent);

//get a order by id
router.get('/:id', getOrderById);

//get all order by a user
router.get('/', getOrderByUser);

module.exports = router;
