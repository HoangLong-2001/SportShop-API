const {
  addToWishlistService,
  getAllWishlistService,
  deleteWItemService,
} = require("../services/wishlist.service");

module.exports = {
  // add an item to wishlist 
  addToWishlist: async (req, res, next) => {
    const customerId = req.payload.userId;
    const productId = req.body.productId;
    console.log(customerId,productId);
    
    try {
      const wishlist = await addToWishlistService(customerId, productId);
      return res.status(201).json({
        data: wishlist,
      });
    } catch (error) {
      next(error);
    }
  },
  //   Get all wishlist's items 
 getAllWishlist: async (req, res, next) => {
    const customerId = req.payload.userId;
    try {
      const wishlist = await getAllWishlistService(customerId);
      return res.status(200).json({
        data: wishlist,
      });
    } catch (error) {
      next(error)
    }
  },
  // Delete an item in wishlist
  deleteWishlistItem:async(req,res,next)=>{
    try{
      const wishlist = await deleteWItemService(req.body.productId)
      return res.status(200)
    }catch(error){
      next(error)
    }
  }
};
