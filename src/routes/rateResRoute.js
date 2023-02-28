const express = require('express');
const { createRateRes, getRateResByRestaurant, getRateResByUser, getRateResList } = require('../controllers/rateResController');
const rateResRoute = express.Router();

rateResRoute.post("/createRateRes", createRateRes);
rateResRoute.get("/getRateResByRestaurant/:res_id", getRateResByRestaurant);
rateResRoute.get("/getRateResByUser/:user_id", getRateResByUser);
rateResRoute.get("/", getRateResList);

module.exports = rateResRoute;