const express = require('express');
const { verifyAccessToken } = require('../services/jwtService');
const { addToWishlist, getAllWishlist, deleteWishlistItem } = require('../controller/wishlist.controller');
const Router = express.Router();
Router.post('/',verifyAccessToken,addToWishlist)
Router.get("/",verifyAccessToken,getAllWishlist)
Router.delete('/',verifyAccessToken,deleteWishlistItem)
module.exports = Router