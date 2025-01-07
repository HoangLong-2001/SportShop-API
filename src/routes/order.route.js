const express = require("express");
const { getAllOrders, updateAnOrder, deleteAnOrder } = require('../controller/order.controller');
const { verifyAccessToken } = require("../services/jwtService");
const permission = require("../middlewares/permission");
const router = express.Router();

router.get('/',verifyAccessToken,getAllOrders)
router.post('/')
router.put('/:id',updateAnOrder)
router.delete('/:id',deleteAnOrder)
module.exports = router;
