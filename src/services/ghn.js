class GiaoHangNhanhService {
  static async getProvinces() {
    const res = await fetch(`${process.env.GHN_ADDRESS_API_URL}/province`, {
      method: "GET",
      headers: {
        Token: process.env.GHN_TOKEN_API,
      },
    });

    return (await res.json()).data;
  }

  static async getDistrictsByProvinceId(provinceId) {
    const res = await fetch(
      `${process.env.GHN_ADDRESS_API_URL}/district?province_id=${provinceId}`,
      {
        method: "GET",
        headers: {
          Token: process.env.GHN_TOKEN_API,
        },
      }
    );

    return (await res.json()).data;
  }

  static async getWardsByDistrictId(districtId) {
    const res = await fetch(
      `${process.env.GHN_ADDRESS_API_URL}/ward?district_id=${districtId}`,
      {
        method: "GET",
        headers: {
          Token: process.env.GHN_TOKEN_API,
        },
      }
    );

    return (await res.json()).data;
  }

  static async getStoreInformation() {
    const res = await fetch(`${process.env.GHN_V2_API_URL}/shop/all`, {
      method: "POST",
      headers: {
        Token: process.env.GHN_TOKEN_API,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offset: 0,
        limit: 2,
      }),
    });
    return (await res.json()).data;
  }

  static async getAvailableShippingServices({
    shopId,
    fromDistrictId,
    toDistrictId,
  }) {
    const res = await fetch(
      `${process.env.GHN_V2_API_URL}/shipping-order/available-services`,
      {
        method: "POST",
        headers: {
          Token: process.env.GHN_TOKEN_API,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shop_id: shopId,
          from_district: fromDistrictId,
          to_district: toDistrictId,
        }),
      }
    );

    return (await res.json()).data;
  }

  static async calculateOrderFee(
    shopId,
    {
      fromDistrictId,
      fromWardCode,
      toDistrictId,
      toWardCode,
      serviceId,
      weightInGram,
    }
  ) {
    const res = await fetch(
      `${process.env.GHN_V2_API_URL}/shipping-order/fee`,
      {
        method: "POST",
        headers: {
          Token: process.env.GHN_TOKEN_API,
          "Content-Type": "application/json",
          ShopId: shopId,
        },
        body: JSON.stringify({
          from_district_id: fromDistrictId,
          from_ward_code: fromWardCode,
          service_id: serviceId,
          to_district_id: toDistrictId,
          to_ward_code: toWardCode,
          weight: weightInGram,
        }),
      }
    );

    return await res.json();
  }
}

module.exports = GiaoHangNhanhService;
