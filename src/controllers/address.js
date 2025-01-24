const { CreatedResponse, OKResponse } = require("../response/success");
const AddressService = require("../services/address");
const GiaoHangNhanhService = require("../services/ghn");

class AddressController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await AddressService.create(req.account.id, req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await AddressService.getAddressesByAccountId(+req.account.id),
    }).send(res);
  }

  static async getProvinces(req, res) {
    new OKResponse({
      metadata: await GiaoHangNhanhService.getProvinces(),
    }).send(res);
  }

  static async getDistricts(req, res) {
    new OKResponse({
      metadata: await GiaoHangNhanhService.getDistrictsByProvinceId(
        +req.query.provinceId
      ),
    }).send(res);
  }

  static async getWards(req, res) {
    new OKResponse({
      metadata: await GiaoHangNhanhService.getWardsByDistrictId(
        req.query.districtId
      ),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await AddressService.updateById(
        +req.params.addressId,
        +req.account.id,
        req.body
      ),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await AddressService.deleteById(
        +req.params.addressId,
        +req.account.id
      ),
    }).send(res);
  }
}

module.exports = AddressController;
