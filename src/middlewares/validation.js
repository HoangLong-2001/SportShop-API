const Joi = require("joi").extend(require("@joi/date"));
const createError = require("http-errors");
module.exports = {
  loginValidation: (req, res, next) => {
    try {
      const customerSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
          .required(),
        type: Joi.allow(),
        role: Joi.allow(),
      });
      const { error } = customerSchema.validate(req.body, {
        abortEarly: false,
      });
      console.log(error);

      if (error) {
        throw createError.BadRequest('Email hoặc mật khẩu không chính xác');
      }
      return next();
    } catch (err) {
      return next(err);
    }
  },
  registerValidation: (req, res, next) => {
    try {
      const customerSchema = Joi.object({
        name: Joi.string()
          .regex(
            /^([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸ\s]{2,100})\s{0,1}([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]{0,6})$/i
          )
          .required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          .min(8)
          .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/i)
          .required(),
        gender: Joi.string().allow(),
        phoneNumber: Joi.string().allow(),
        birthDay: Joi.allow(),
        role: Joi.allow(),
      });
      const { error } = customerSchema.validate(req.body);
      if (error) {
        console.log(error);
        throw createError.BadRequest("Tên, Mật khẩu hoặc email không đúng định dạng ");
      }
      return next();
    } catch (err) {
      return next(err);
    }
  },
  createProductValidation: (req, res, next) => {
    try {
      const productSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.required(),
        discount: Joi.required(),
        category: Joi.string().required(),
        brand: Joi.string().required(),
        tags: Joi.allow(),
        sports: Joi.allow(),
        stock: Joi.required(),
        colors: Joi.required(),
        sizes: Joi.required(),
        rate: Joi.number(),
        newArrival: Joi.bool(),
        images: Joi.allow(),
        genders: Joi.allow(),
      });
      const { error } = productSchema.validate(req.body, { abortEarly: false });
      console.log(error);
      if (error) {
        throw createError.BadRequest(error.message);
      }
      console.log("test");

      return next();
    } catch (err) {
      return next(err);
    }
  },
  updateACustomerValidation: (req, res, next) => {
    try {
      const customerSchema = Joi.object({
        name: Joi.string().regex(
          /^([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸ\s]{2,100})\s{0,1}([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]{0,6})$/
        ),
        email: Joi.string().email().allow(),
        password: Joi.string()
          .min(8)
          .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/i)
          .allow(),
        confirm__password: Joi.string()
          .min(8)
          .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/i)
          .allow(),
        gender: Joi.string().allow(),
        phoneNumber: Joi.string().allow(),
        birthDay: Joi.allow(),
        role: Joi.allow(),
        address: Joi.allow(),
      });
      const { error } = customerSchema.validate(req.body);
      console.log(error);

      if (error) {
        throw createError.BadRequest(
          "Tên, Mật khẩu hoặc email không đúng định dạng "
        );
      }
      return next();
    } catch (err) {
      next(err);
    }
  },

  updateAnEmployeeValidation: (req, res, next) => {
    try {
      const employeeSchema = Joi.object({
        name: Joi.string().regex(
          /^([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸ\s]{2,100})\s{0,1}([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]{0,6})$/i
        ),
        // email: Joi.string().email(),
        password: Joi.string()
          .min(8)
          .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
          .allow(),
        newPassword: Joi.string()
          .min(8)
          .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
          .allow(),
        phoneNumber: Joi.string()
          .regex(/^(\+84)|0([358]\d{8,8}|9\d{7,8})$/)
          .message("Số điện thoại không hợp lệ"),
        gender: Joi.allow(),
        birthDay: Joi.date().format("DD-MM-YYYY"),
      });
      const { error } = employeeSchema.validate(req.body);
      console.log(error);

      if (error) {
        throw createError.BadRequest(error.message);
      }
      return next();
    } catch (err) {
      next(err);
    }
  },

  createAnEmployeeValid: (req, res, next) => {
    console.log(req.body);

    try {
      const employeeSchema = Joi.object({
        name: Joi.string()
          .regex(
            /^([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸ\s]{2,100})\s{0,1}([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]{0,6})$/i
          )
          .required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          .min(8)
          .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
          .required(),
        gender: Joi.string().allow(),
        phoneNumber: Joi.string().regex(/^(\+84)|0([358]\d{8,8}|9\d{7,8})$/),
        birthDay: Joi.allow(),
        role: Joi.allow(),
        type: Joi.allow(),
      });
      const { error } = employeeSchema.validate(req.body);

      if (error) {
        throw createError.BadRequest(error.message);
      }
      return next();
    } catch (err) {
      next(err);
    }
  },
  orderValidation: (req, res, next) => {
    try {
      const orderSchema = Joi.object({
        name: Joi.string()
          .regex(
            /^([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸ\s]{2,100})\s{0,1}([a-zA-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]{0,6})$/i
          )
          .required()
          .message("Tên không hợp lệ"),
        phoneNumber: Joi.string()
          .regex(/^(\+84)|0([358]\d{8,8}|9\d{7,8})$/)
          .required()
          .message("Số điện thoại không hợp lệ"),
        address: Joi.string().required(),
        email: Joi.allow(),
        payment_method: Joi.string(),
        coupon: Joi.string().allow(),
      });
      const { error } = orderSchema.validate(req.body);

      if (error) {
        throw createError.BadRequest(error.message);
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  forgotPasswordValidation: (req, res, next) => {
    try {
      const forgotSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
          .required(),
        otp: Joi.string().required(),
        type: Joi.allow(),
      });
      const { error } = forgotSchema.validate(req.body);

      if (error) {
        throw createError.BadRequest(error.message);
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};
