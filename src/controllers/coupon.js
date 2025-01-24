const { CreatedResponse, OKResponse } = require("../response/success");
const CouponService = require("../services/coupon");

class CouponController {
  static async createCoupon(req, res) {
    new CreatedResponse({
      message: "Coupon created successfully",
      metadata: await CouponService.create(req.body),
    }).send(res);
  }

  static async updateCoupon(req, res) {
    new OKResponse({
      message: "Coupon updated successfully",
      metadata: await CouponService.update(+req.params.couponId, req.body),
    }).send(res);
  }

  static async deleteCoupon(req, res) {
    await CouponService.delete(+req.params.couponId);
    new OKResponse({
      message: "Coupon deleted successfully",
    }).send(res);
  }

  static async getByCode(req, res) {
    new OKResponse({
      message: "Coupon retrieved successfully",
      metadata: await CouponService.getByCode(req.params.code),
    }).send(res);
  }

  static async getCollectedCoupons(req, res) {
    new OKResponse({
      message: "Collected coupons retrieved successfully",
      metadata: await CouponService.getCollectedCoupons(+req.account.id),
    }).send(res);
  }

  static async getAllCoupons(req, res) {
    new OKResponse({
      message: "Coupons retrieved successfully",
      metadata: await CouponService.getAll(),
    }).send(res);
  }

  static async getValidCoupons(req, res) {
    new OKResponse({
      message: "Valid coupons retrieved successfully",
      metadata: await CouponService.getValidCoupons(),
    }).send(res);
  }

  static async collectCoupon(req, res) {
    new CreatedResponse({
      message: "Coupon collected successfully",
      metadata: await CouponService.collectCoupon(
        +req.account.id,
        req.body.couponCode
      ),
    }).send(res);
  }
}

module.exports = CouponController;
