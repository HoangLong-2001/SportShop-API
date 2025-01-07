const Products = require("../models/Products");
const aqp = require("api-query-params");
const createHttpError = require("http-errors");
const Cart = require("../models/Cart");
const appendTags = (category, tags) => {
  const items = [];
  switch (category) {
    case "SHIRT":
      ["JACKETS", "T-SHIRT", "POLO", "HOODIE"].forEach((item) => {
        if (tags?.includes(item)) items.push(item);
        else return;
      });
      return items;
    case "TROUSERS":
      ["LONG-PANTS", "SHORTS", "DRAWERS"].forEach((item) => {
        if (tags?.includes(item)) items.push(item);
        else return;
      });
      return items;
    case "SHOES":
      return items;
    case "ACCESSORY":
      ["BALO", "CAP", "SOCKS"].forEach((item) => {
        if (tags?.includes(item)) items.push(item);
        else return;
      });
      return items;
  }
  return [];
};
const createAProduct = async (product) => {
  const result = await Products.create(product);
  return result;
};
const getAllProductService = async (query) => {
  const {
    filter = {},
    skip = 0,
    limit = 1000,
    sort = {},
    populate = "",
  } = aqp(query);
  const newFilter = {};
  const priceArr = [];
  const orArr = [];
  [...new Set(query.category?.split(","))].forEach((item) => {
    const objectFilter = {};
    objectFilter.category = item;
    const tags = appendTags(item, query.tags);
    if (tags.length) {
      objectFilter.tags = { $in: tags };
    }
    orArr.push(objectFilter);
  });
  console.log(orArr[0]?.tags);

  delete filter["category"];
  delete filter["tags"];
  Object.keys(filter).forEach((key) => {
    if (key === "price") {
      filter[key]["$in"].forEach((item, index) => {
        if (index % 2 === 0) {
          priceArr.push({
            price: { $gt: item, $lt: filter[key]["$in"][index + 1] },
          });
        }
      });
      delete filter["price"];
    }
  });
  if (priceArr.length) newFilter.$or = [...priceArr];
  else if (orArr.length) newFilter.$or = [...orArr];
  console.log(">>> Check new filter:", { ...filter, ...newFilter });
  const products = await Products.find({ ...filter, ...newFilter })
    .populate(populate)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  if (products.length === 0) {
    throw createHttpError.NotFound();
  }
  return products;
};
const getAProductService = async (productId) => {
  const product = await Products.findById(productId);
  if (!product) throw createHttpError.NotFound("Không tìm thấy sản phẩm");
  return product;
};
const deleteAProductService = async (productId) => {
  console.log(">>> check productId", productId);

  const product = await Products.findOneAndDelete({ _id: productId });
  const cart = await Cart.deleteOne({ info: productId });
  console.log(">>> check cart", cart);
  if (!product) throw createHttpError.NotFound("Không tìm thấy sản phẩm");
  return product;
};
const updateAProductService = async (productId, data) => {
  const product = await Products.findByIdAndUpdate(
    { _id: productId },
    { ...data }
  );

  if (!product) throw createHttpError.NotFound("Không tìm thấy sản phẩm");
  return product;
};
// const searchProductService = async (query) => {
//   const data = await Products.find({});
// };
module.exports = {
  createAProduct,
  getAllProductService,
  getAProductService,
  updateAProductService,
  deleteAProductService,
};
