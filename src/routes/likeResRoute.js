const express = require('express');
const { likeRes, unLikeRes, getLikeResByRestaurant, getLikeResByUser, getLikeResList } = require('../controllers/likeResController');
const likeResRoute = express.Router();

likeResRoute.post("/createLikeRes", likeRes);
likeResRoute.post("/unLikeRes", unLikeRes);
likeResRoute.get("/getLikeResByRestaurant/:res_id", getLikeResByRestaurant);
likeResRoute.get("/getLikeResByUser/:user_id", getLikeResByUser);
likeResRoute.get("/", getLikeResList);

module.exports = likeResRoute;