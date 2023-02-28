const express = require('express');
const { createOrder } = require('../controllers/orderController');

const orderRoute = express.Router();

orderRoute.post('/createOrder', createOrder);

module.exports = {
    orderRoute
}