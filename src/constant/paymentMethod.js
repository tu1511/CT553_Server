const COD = "Thanh toán khi nhận hàng";
const VNPAY = "Thanh toán qua VNPAY";

const PAYMENT_METHOD = [COD, VNPAY];

const PAYMENT_METHOD_ID_MAPPING = {
  ALL: 0,
  COD: 1,
  VNPAY: 2,
};

module.exports = {
  COD,
  VNPAY,
  PAYMENT_METHOD,
  PAYMENT_METHOD_ID_MAPPING,
};
