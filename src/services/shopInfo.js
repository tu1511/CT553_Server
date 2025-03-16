const prisma = require("../config/prismaClient");

class ShopInfoService {

    static async getOne() {
        return await prisma.shopInfo.findFirst({
            orderBy: {
                id: 'asc',
            },
            include: {
                logo: true,
            }
        });
    }

    static async create({ name, fullName, email, phone, slogan, businessCode, workingTime, isMaintaining,
        provinceId, districtId, wardCode, provinceName, districtName, wardName, detailAddress = "", logoId, maintainingMessage = "" }) {

        const newShopInfo = await prisma.shopInfo.create({
            data: {
                name, fullName, email, phone, slogan, businessCode, workingTime, isMaintaining, provinceId: +provinceId,
                districtId: +districtId, wardCode, provinceName, districtName, wardName, detailAddress, logoId: +logoId, maintainingMessage
            },
        });
        return newShopInfo;
    }

    static async update(
        shopInfoId,
        { name, fullName, email, phone, slogan, businessCode, workingTime, isMaintaining,
            provinceId, districtId, wardCode, provinceName, districtName, wardName, detailAddress = "", logoId, maintainingMessage = "" }
    ) {
        const updatedShopInfo = await prisma.shopInfo.update({
            where: {
                id: +shopInfoId,
            },
            data: {
                name, fullName, email, phone, slogan, businessCode, workingTime, isMaintaining, provinceId: +provinceId,
                districtId: +districtId, wardCode, provinceName, districtName, wardName, detailAddress, logoId: +logoId, maintainingMessage
            }
        });
        return updatedShopInfo;
    }
}

module.exports = ShopInfoService;
