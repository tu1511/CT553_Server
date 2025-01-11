const prisma = require("../../config/prismaClient");
const { AWAITING_CONFIRM, AWAITING_FULFILLMENT, DELIVERING, DELIVERED, CANCELED, RETURNED } = require("../../constant/orderStatus");
const { PENDING, SUCCESS, FAILED } = require("../../constant/paymentStatus");

async function uploadRoles() {
    // delete all roles
    await prisma.role.createMany({
        data: [
            { role: "ADMIN" },
            { role: "EMPLOYEE" },
            { role: "USER" },
        ]
    });
}

async function uploadPaymentMethods() {
    await prisma.paymentMethod.createMany({
        data: [
            { name: "COD" },
            { name: "VNPAY" },
        ]
    });
}

async function uploadPaymentStatuses() {
    await prisma.paymentStatus.createMany({
        data: [
            { name: PENDING },
            { name: SUCCESS },
            { name: FAILED },
        ]
    });
}

async function uploadOrderStatuses() {
    await prisma.orderStatus.createMany({
        data: [
            { name: AWAITING_CONFIRM },
            { name: AWAITING_FULFILLMENT },
            { name: DELIVERING },
            { name: DELIVERED },
            { name: CANCELED },
            { name: RETURNED },
        ]
    });
}

async function createDiscountForProducts() {
    // array from 120 to 125
    const productIds = Array.from({ length: 6 }, (_, i) => i + 120);
    await prisma.$transaction(async (tx) => {
        for (const productId of productIds) {
            const discount = {
                discountType: "fixed_amount",
                discountValue: 300000,
                startDate: "2024-10-15",
                endDate: "2024-12-28",
            };

            await tx.productDiscount.create({
                data: {
                    productId: +productId,
                    discountType: discount.discountType,
                    discountValue: +discount.discountValue,
                    startDate: new Date(discount.startDate).toISOString(),
                    endDate: new Date(discount.endDate + "T23:59:59.000Z").toISOString(),
                }
            });
        }
    });
}

async function uploadModules() {
    await prisma.module.createMany({
        data: [
            { name: "Xác thực tài khoản" },
            { name: "Người dùng" },
            { name: "Sản phẩm" },
            { name: "Danh mục sản phẩm" },
            { name: "Coupons" },
            { name: "Đơn hàng" },
            { name: "Đánh giá" },
            { name: "Chính sách" },
            { name: "Cấu hình thông tin cửa hàng" },
            { name: "Banner" },
            { name: "Danh mục banner" },
            { name: "Phân quyền" },
        ]
    });
}

async function uploadPermissions() {
    // authentication
    await prisma.permission.createMany({
        data: [
            { moduleId: 1, name: "Đăng ký tài khoản khách hàng", api: "/api/auth/register", method: "POST" },
            { moduleId: 1, name: "Đăng nhập trang người dùng với email và mật khẩu", api: "/api/auth/login", method: "POST" },
            { moduleId: 1, name: "Đăng nhập trang người dùng bằng tài khoản Google", api: "/api/auth/loginWithGoogle", method: "POST" },
            { moduleId: 1, name: "Đăng nhập trang quản lý với email và mật khẩu", api: "/api/auth/adminLogin", method: "POST" },
            { moduleId: 1, name: "Đăng nhập trang quản lý bằng tài khoản Google", api: "/api/auth/adminLoginWithGoogle", method: "POST" },
            { moduleId: 1, name: "Xem tài khoản đã đăng nhập", api: "/api/auth/logged-in-account", method: "GET" },
        ]
    });

    // user
    await prisma.permission.createMany({
        data: [
            { moduleId: 2, name: "Tạo tài khoản", api: "/api/accounts", method: "POST" },
            { moduleId: 2, name: "Xem danh sách tài khoản", api: "/api/accounts", method: "GET" },
            { moduleId: 2, name: "Xem thông tin tài khoản", api: "/api/accounts/:accountId", method: "GET" },
            { moduleId: 2, name: "Cập nhật thông tin tài khoản của mình", api: "/api/accounts", method: "PUT" },
            { moduleId: 2, name: "Cập nhật thông tin tài khoản bởi admin", api: "/api/accounts/:accountId", method: "PUT" },
            { moduleId: 2, name: "Thay đổi password", api: "/api/accounts/password", method: "PUT" },
            { moduleId: 2, name: "Khóa tài khoản", api: "/api/accounts/toggleActive/:accountId", method: "PUT" },
        ]
    });

    // product
    await prisma.permission.createMany({
        data: [
            { moduleId: 3, name: "Tạo sản phẩm", api: "/api/products", method: "POST" },
            { moduleId: 3, name: "Xem danh sách sản phẩm", api: "/api/products", method: "GET" },
            { moduleId: 3, name: "Xem thông tin sản phẩm với chương trình giảm giá hiện tại", api: "/api/products/slug/:slug", method: "GET" },
            { moduleId: 3, name: "Xem thông tin sản phẩm với tất cả các chương trình giảm giá", api: "/api/products/slug/allDiscounts/:slug", method: "GET" },
            { moduleId: 3, name: "Cập nhật thông tin sản phẩm", api: "/api/products/:id", method: "PUT" },
            { moduleId: 3, name: "Tìm kiếm sản phẩm bằng từ khóa", api: "/api/products/search", method: "GET" },
            { moduleId: 3, name: "Tìm kiếm sản phẩm bằng hình ảnh", api: "/api/products/search/image", method: "GET" },
        ]
    });

    // category
    await prisma.permission.createMany({
        data: [
            { moduleId: 4, name: "Tạo danh mục sản phẩm", api: "/api/categories", method: "POST" },
            { moduleId: 4, name: "Xem danh sách danh mục sản phẩm", api: "/api/categories", method: "GET" },
            { moduleId: 4, name: "Xem thông tin danh mục sản phẩm", api: "/api/categories/:categoryId", method: "GET" },
            { moduleId: 4, name: "Cập nhật thông tin danh mục sản phẩm", api: "/api/categories/:id", method: "PUT" },
        ]
    });

    // coupon
    await prisma.permission.createMany({
        data: [
            { moduleId: 5, name: "Tạo coupon", api: "/api/coupons", method: "POST" },
            { moduleId: 5, name: "Xem danh sách coupon hiện đang có", api: "/api/coupons/valid", method: "GET" },
            { moduleId: 5, name: "Xem danh sách tất cả coupon", api: "/api/coupons", method: "GET" },
            { moduleId: 5, name: "Xem thông tin coupon", api: "/api/coupons/:code", method: "GET" },
            { moduleId: 5, name: "Cập nhật thông tin coupon", api: "/api/coupons/:couponId", method: "PUT" },
        ]
    });

    // order
    await prisma.permission.createMany({
        data: [
            { moduleId: 6, name: "Tạo đơn hàng", api: "/api/orders", method: "POST" },
            { moduleId: 6, name: "Xem danh sách tất cả đơn hàng", api: "/api/orders/all", method: "GET" },
            { moduleId: 6, name: "Xem thông tin đơn hàng", api: "/api/orders/:orderId", method: "GET" },
            { moduleId: 6, name: "Cập nhật trạng thái đơn hàng", api: "/api/orders/:orderId/status", method: "PUT" },
            { moduleId: 6, name: "Khách hàng xem danh sách đơn hàng của mình", api: "/api/orders", method: "GET" },
            { moduleId: 6, name: "Hủy đơn hàng", api: "/api/orders/:orderId", method: "PUT" },
        ]
    });

    // review
    await prisma.permission.createMany({
        data: [
            { moduleId: 7, name: "Tạo đánh giá", api: "/api/reviews", method: "POST" },
            { moduleId: 7, name: "Xem danh sách tất cả đánh giá", api: "/api/reviews", method: "GET" },
            { moduleId: 7, name: "Xem danh sách đánh giá của sản phẩm", api: "/api/reviews/:productId", method: "GET" },
            { moduleId: 7, name: "Xem thông tin đánh giá", api: "/api/reviews/:reviewId", method: "GET" },
            { moduleId: 7, name: "Chỉnh sửa đánh giá của mình", api: "/api/reviews/:reviewId", method: "PUT" },
            { moduleId: 7, name: "Ẩn đánh giá", api: "/api/reviews/toggleHide/:reviewId", method: "PUT" },
        ]
    });

    // payment policy
    const baseApi = [
        "paymentPolicies",
        "deliveryPolicies",
        "checkProductPolicies",
        "returnPolicies",
        "warrantyPolicies",
        "securityPolicies",
    ];

    const data = baseApi.map(api => {
        const temp = [
            { moduleId: 8, name: "Tạo chính sách", api: `/api/${api}`, method: "POST" },
            { moduleId: 8, name: "Xem danh sách chính sách", api: `/api/${api}`, method: "GET" },
            { moduleId: 8, name: "Xem thông tin chính sách hiện hành", api: `/api/${api}/current`, method: "GET" },
            { moduleId: 8, name: "Xem thông tin chính sách", api: `/api/${api}/:policyId`, method: "GET" },
            { moduleId: 8, name: "Cập nhật chính sách", api: `/api/${api}/:policyId`, method: "PUT" },
            { moduleId: 8, name: "Ẩn chính sách", api: `/api/${api}/toggleHide/:policyId`, method: "PUT" },
        ]
        return temp;
    });

    // spread data to array of objects
    const finalData = [].concat(...data);

    await prisma.permission.createMany({
        data: finalData
    });

    // shop info
    await prisma.permission.createMany({
        data: [
            { moduleId: 9, name: "Xem thông tin cửa hàng", api: "/api/shopInfo", method: "GET" },
            { moduleId: 9, name: "Cập nhật thông tin cửa hàng", api: "/api/shopInfo/:shopInfoId", method: "PUT" },
        ]
    });

    // banner
    await prisma.permission.createMany({
        data: [
            { moduleId: 10, name: "Tạo banner", api: "/api/banners", method: "POST" },
            { moduleId: 10, name: "Xem danh sách tất cả banner", api: "/api/banners/admin", method: "GET" },
            { moduleId: 10, name: "Xem danh sách banner hiện tại", api: "/api/banners/getByBannerCategory/:bannerCategoryId", method: "GET" },
            { moduleId: 10, name: "Cập nhật thông tin banner", api: "/api/banners/:id", method: "PUT" },
        ]
    });

    // banner category
    await prisma.permission.createMany({
        data: [
            { moduleId: 11, name: "Tạo danh mục banner", api: "/api/bannerCategories", method: "POST" },
            { moduleId: 11, name: "Xem danh sách danh mục banner", api: "/api/bannerCategories", method: "GET" },
            { moduleId: 11, name: "Cập nhật thông tin danh mục banner", api: "/api/bannerCategories/:id", method: "PUT" },
        ]
    });

    // permission
    // await prisma.permission.createMany({
    //     data: [
    //         { moduleId: 12, name: "Tạo quyền", api: "/api/permissions", method: "POST" },
    //         { moduleId: 12, name: "Xem danh sách quyền", api: "/api/permissions", method: "GET" },
    //         { moduleId: 12, name: "Xem thông tin quyền", api: "/api/permissions/:permissionId", method: "GET" },
    //         { moduleId: 12, name: "Cập nhật thông tin quyền", api: "/api/permissions/:permissionId", method: "PUT" },
    //     ]
    // });

}

module.exports = { uploadRoles, uploadPaymentMethods, uploadPaymentStatuses, uploadOrderStatuses, createDiscountForProducts, uploadPermissions, uploadModules };