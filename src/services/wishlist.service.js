const createHttpError = require("http-errors");
const Customer = require("../models/Customers");
const Wishlist = require("../models/Wishlist");
// All wishlist service
module.exports = {
  // add an item to wishlist service
  addToWishlistService: async (customerId, productId) => {
    const wishlist = await Wishlist.create({ customerId, product:productId });
    return wishlist;
  },
  getAllWishlistService: async (customerId) => {
    const wishlist = await Wishlist.find({customerId}).populate("product");
    console.log("check wishlist data:",wishlist);
    
    if (!wishlist) throw createHttpError.NotFound("Không tìm thấy thông tin");
    return wishlist;
  },
  deleteWItemService:async(productId)=>{
    const wishlist = await Wishlist.deleteOne({product:productId});
    return wishlist
  }
};
