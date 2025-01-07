const createHttpError = require("http-errors");
const {
  createAProduct,
  getAllProductService,
  getAProductService,
  deleteAProductService,
  updateAProductService,
} = require("../services/product.service");
const {
  uploadMultiFiles,
  uploadSingleFile,
} = require("../services/file.service");

const postCreateAProduct = async (req, res, next) => {
  console.log(">>> check post bdy:", req.body);

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      throw createHttpError.NotFound("No files were uploaded.");
    }
    let imgList;
    if (req.files.images instanceof Array) {
      const uploadImg = await uploadMultiFiles(req.files.images);
      imgList = uploadImg.resultArr.map((item) => item.path);
    } else {
      const uploadImg = await uploadSingleFile(req.files.images);
      imgList = new Array(uploadImg.path);
    }

    let productData = {
      images: imgList,
    };
    for (let key in req.body) {
      if (req.body[key]) {
        productData[key] = req.body[key];
      }
    }
    const product = await createAProduct(productData);
    return res.status(201).json({
      data: product,
    });
  } catch (err) {
    return next(err);
  }
};
const getAllProducts = async (req, res, next) => {
  try {
    const products = await getAllProductService(req.query);
    return res.status(200).json({
      data: products,
    });
  } catch (err) {
    console.log(err);
    
    next(err);
  }
};
const getAProduct = async (req, res, next) => {
  console.log(req.params.id);

  try {
    const productId = req.params.id;
    const product = await getAProductService(productId);
    return res.status(200).json({
      data: product,
    });
  } catch (err) {
    next(err);
  }
};
const deleteAProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await deleteAProductService(productId);
    return res.status(201).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
const updateAProduct = async (req, res, next) => {
  console.log(">>> check body", req.body);
  try {
    const productId = req.params.id;
    let productData = {};
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log(">>>No files were uploaded.");
    } else {
      let imgList;
      if (req.files.images instanceof Array) {
        const uploadImg = await uploadMultiFiles(req.files.images);
        imgList = uploadImg.resultArr.map((item) => item.path);
        console.log("image list",imgList);
        
      } else {
        const uploadImg = await uploadSingleFile(req.files.images);
        imgList = new Array(uploadImg.path);
      }

      productData = {
        images: imgList,
      };
    }

    for (let key in req.body) {
      if (req.body[key]) {
        productData[key] = req.body[key];
      }
    }
    console.log(">>> Check update data:", productData);

    const product = await updateAProductService(productId, productData);
    return res.status(201).json({
      data: product,
    });
  } catch (err) {
    return next(err);
  }
};
module.exports = {
  postCreateAProduct,
  getAllProducts,
  getAProduct,
  deleteAProduct,
  updateAProduct,
};
