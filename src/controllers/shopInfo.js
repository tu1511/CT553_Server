const { CreatedResponse, OKResponse } = require("../response/success");
const ShopInfoService = require("../services/shopInfo");

class ShopInfoController {

    static async getOne(req, res) {
        new OKResponse({
            metadata: await ShopInfoService.getOne(),
        }).send(res);
    }

    static async create(req, res) {
        new CreatedResponse({
            metadata: await ShopInfoService.create(req.body),
        }).send(res);
    }

    static async update(req, res) {
        new CreatedResponse({
            metadata: await ShopInfoService.update(req.params.shopInfoId, req.body),
        }).send(res);
    }
}

module.exports = ShopInfoController;
