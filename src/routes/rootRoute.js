const express = require('express');
const likeResRoute = require('./likeResRoute');
const { orderRoute } = require('./orderRoute');
const rateResRoute = require('./rateResRoute');
const rootRoute = express.Router();

rootRoute.use("/like-res", likeResRoute);
rootRoute.use("/rate-res", rateResRoute);
rootRoute.use("/order", orderRoute)

module.exports = rootRoute;
