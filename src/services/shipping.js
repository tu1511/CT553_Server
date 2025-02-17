const GiaoHangNhanhService = require("./ghn");

class ShippingService {
  static async calculateShippingFee({
    toDistrictId,
    toWardCode,
    weightInGram,
  }) {
    // lay shop thu 2
    const shopInfo = (await GiaoHangNhanhService.getStoreInformation())
      .shops[1];

    // console.log("shopInfo", shopInfo);

    const availableServices =
      await GiaoHangNhanhService.getAvailableShippingServices({
        shopId: shopInfo._id,
        fromDistrictId: shopInfo.district_id,
        toDistrictId,
      });

    console.log("availableServices", availableServices);

    const DEFAULT_SERVICE_ID = availableServices[0].service_id;

    const orderFee = await GiaoHangNhanhService.calculateOrderFee(
      shopInfo._id,
      {
        serviceId: DEFAULT_SERVICE_ID,
        fromDistrictId: shopInfo.district_id,
        fromWardCode: shopInfo.ward_code,
        toDistrictId,
        toWardCode,
        weightInGram,
      }
    );

    return orderFee.data;
  }
}

module.exports = ShippingService;
