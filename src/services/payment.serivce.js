const createHttpError = require("http-errors");
const Cart = require("../models/Cart");
const Order = require("../models/Orders");
const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const Products = require("../models/Products");
const { buffer } = require("stream/consumers");
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  cashPaymentService: async (customerId, customerInfo) => {
    const items = [];
    const cart = await Cart.find({ customerId }).populate("info");
    let total = 0;
    cart.forEach((item) => {
      total = total + parseInt(item.info.discountPrice * item.quantity);
      items.push({
        product_id: item.info._id,
        quantity: item.quantity,
        price: parseInt(item.info.discountPrice * item.quantity),
        size: item.size,
        color: item.color,
      });
    });
    items.forEach((item) => {
      Products.updateQuantity(item);
    });

    const order = await Order.create({
      order_detail: items,
      totalAmount: total,
      customerId: customerId,
      shippingAddress: customerInfo.address,
      phoneNumber: customerInfo.phoneNumber,
      customer_name: customerInfo.name,
      email: customerInfo.email || null,
      paymentMethod: "cash",
    });
    await Cart.deleteMany({ customerId });
    return order;
  },
  vnpayPaymentService: async (ipAddr, customerId, customerInfo) => {
    const items = [];
    const cart = await Cart.find({ customerId }).populate("info");
    let total = 0;
    cart.forEach((item) => {
      total = total + parseInt(item.info.discountPrice * item.quantity);
      items.push({
        product_id: item.info._id,
        quantity: item.quantity,
        price: parseInt(item.info.discountPrice * item.quantity),
        size: item.size,
        color: item.color,
      });
    });
    items.forEach((item) => {
      Products.updateQuantity(item);
    });
    const order = await Order.create({
      order_detail: items,
      totalAmount: total,
      customerId: customerId,
      shippingAddress: customerInfo.address,
      phoneNumber: customerInfo.phoneNumber,
      customer_name: customerInfo.name,
      email: customerInfo.email || null,
      paymentMethod: "VNPAY",
    });
    await Cart.deleteMany({ customerId });
    process.env.TZ = "Asia/Ho_Chi_Minh";
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
    let tmnCode = process.env.VNP_TmnCode;
    let secretKey = process.env.VNP_HashSecret;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_ReturnUrl;
    let orderId = order._id;
    let amount = total;
    let bankCode = null;

    let locale = null;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho đơn hàng số:" + orderId;
    vnp_Params["vnp_OrderType"] = "160000";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });

    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData,'utf-8')).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    return vnpUrl;
  },
  vnpayReturnService: async (vnp_Params) => {
    let secureHash = vnp_Params["vnp_SecureHash"];
    let orderId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let tmnCode = process.env.VNP_TmnCode;
    let secretKey = process.env.VNP_HashSecret;

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData,'utf-8')).digest("hex");

    let order = await Order.findById(orderId);

    if (secureHash === signed) {
      switch (rspCode) {
        case "00":
          order.isPaid = true;
          await order.save();
          return {
            status: { RspCode: "00", Message: "Giao dịch thành công" },
          };
        case "24":
          await Order.findByIdAndDelete(orderId);
          return {
            status: {
              RspCode: "24",
              Message:
                "Giao dịch không thành công do: Khách hàng hủy giao dịch",
            },
          };
        case "10":
          await Order.findByIdAndDelete(orderId);
          return {
            status: {
              RspCode: "49",
              Message:
                "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
            },
          };
        case "11":
          await Order.findByIdAndDelete(orderId);
          return {
            status: {
              RspCode: "11",
              Message:
                "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
            },
          };
        case "12":
          await Order.findByIdAndDelete(orderId);
          return {
            status: {
              RspCode: "12",
              Message:
                "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
            },
          };
        default:
          await Order.findByIdAndDelete(orderId);
          return {
            status: {
              RspCode: "99",
              Message: "Giao dịch không thành công",
            },
          };
      }
    } else {
      throw createHttpError.BadRequest(
        JSON.stringify({ RspCode: "99", Message: "Giao dịch không thành công" })
      );
    }
  },

  vnpayInputService: async (vnp_Params) => {
    let secureHash = vnp_Params["vnp_SecureHash"];
    let orderId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.VNP_HashSecret;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData,'utf-8')).digest("hex");

    let order = await Order.findById(orderId);

    let checkOrderId = orderId; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = vnp_Params["vnp_Amount"] / 100 === order.totalAmount; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) {
      //kiểm tra checksum
      if (checkOrderId) {
        console.log("check amount:", checkOrderId);
        if (checkAmount) {
          console.log("check amount:", checkAmount);
          switch (rspCode) {
            case "00":
              return {
                status: { RspCode: "00", Message: "Giao dịch thành công" },
              };
            case "24":
              return {
                status: {
                  RspCode: "24",
                  Message:
                    "Giao dịch không thành công do: Khách hàng hủy giao dịch",
                },
              };
            case "10":
              return {
                status: {
                  RspCode: "49",
                  Message:
                    "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
                },
              };
            case "11":
              return {
                status: {
                  RspCode: "11",
                  Message:
                    "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
                },
              };
            case "12":
              return {
                status: {
                  RspCode: "12",
                  Message:
                    "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
                },
              };
            default:
              return {
                status: {
                  RspCode: "99",
                  Message: "Giao dịch không thành công",
                },
              };
          }
        } else {
          throw createHttpError.BadRequest(
            JSON.stringify({
              RspCode: "04",
              Message: "Giá trị thanh toán không hợp lệ",
            })
          );
        }
      } else {
        throw createHttpError.BadRequest(
          JSON.stringify({ RspCode: "01", Message: "Không tìm thấy đơn hàng" })
        );
      }
    } else {
      await Order.findByIdAndDelete(orderId);
      throw createHttpError.BadRequest(
        JSON.stringify({ RspCode: "97", Message: "Mã kiểm tra không hợp lệ" })
      );
    }
  },
};
