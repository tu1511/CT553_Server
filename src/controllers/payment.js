const moment = require("moment");
const { OKResponse } = require("../response/success");
const PaymentService = require("../services/payment");
const { sortObject } = require("../utils");
const OrderService = require("../services/order");

class PaymentController {
  static async getPaymentMethods(req, res) {
    new OKResponse({
      metadata: await PaymentService.getPaymentMethods(),
    }).send(res);
  }

  static async getPaymentStatuses(req, res) {
    new OKResponse({
      metadata: await PaymentService.getPaymentStatuses(),
    }).send(res);
  }

  static async createPaymentUrlToVNPay(req, res) {
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const createDate = moment(new Date()).format("YYYYMMDDHHmmss");
    const orderId = +req.body.orderId;
    const orderInfo = "Thanh toan qua VNPay cho don hang voi ma " + orderId;
    const orderType = 200000;
    const returnUrl = `${process.env.BACKEND_URL}/api/payments/vnpay_return`;

    let VNPayParams = {};
    VNPayParams["vnp_Version"] = "2.1.0";
    VNPayParams["vnp_Command"] = "pay";
    VNPayParams["vnp_TmnCode"] = process.env.VNPAY_TMN_CODE;
    // VNPayParams['vnp_Merchant'] = ''
    VNPayParams["vnp_Locale"] = "vn";
    VNPayParams["vnp_CurrCode"] = "VND";
    VNPayParams["vnp_TxnRef"] =
      orderId + "-" + moment(new Date()).format("HHmmss");
    VNPayParams["vnp_OrderInfo"] = orderInfo;
    VNPayParams["vnp_OrderType"] = orderType;
    VNPayParams["vnp_Amount"] = +req.body.amount * 100;
    VNPayParams["vnp_ReturnUrl"] = returnUrl;
    VNPayParams["vnp_IpAddr"] = ipAddr;
    VNPayParams["vnp_CreateDate"] = createDate;

    VNPayParams = sortObject(VNPayParams);

    let querystring = require("qs");
    let signData = querystring.stringify(VNPayParams, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", process.env.VNPAY_HASH_SECRET);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    VNPayParams["vnp_SecureHash"] = signed;

    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    vnpUrl += "?" + querystring.stringify(VNPayParams, { encode: false });

    new OKResponse({
      metadata: {
        redirectUrl: vnpUrl,
      },
    }).send(res);
  }

  static async handleVNPayReturn(req, res) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = process.env.VNPAY_TMN_CODE;
    let secretKey = process.env.VNPAY_HASH_SECRET;
    const orderId = vnp_Params["vnp_TxnRef"].split("-")[0];

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      await OrderService.updatePaymentStatus(
        +orderId,
        vnp_Params["vnp_ResponseCode"]
      );
      // res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
      res.redirect(
        `${process.env.FRONTEND_URL}/tai-khoan/quan-ly-don-hang/${orderId}?code=${vnp_Params["vnp_ResponseCode"]}`
        // `${process.env.FRONTEND_URL}/tai-khoan/quan-ly-don-hang/${orderId}`
      );
    } else {
      res.json({ code: "97" });
    }
  }
}

module.exports = PaymentController;
