const { default: slugify } = require("slugify");
const prisma = require("../../config/prismaClient");
const { getOneBySlug } = require("../category");
const { changeImageUrlToFile } =  require("../../utils/index");

const getSlug = (name) => slugify(name, { lower: true, locale: "vi" });

const parentCategories = [
    {
        name: "Tranh theo vị trí",
        thumbnailImageUrl: "https://lala.com.vn/_next/image?url=https%3A%2F%2Fstc.subi.vn%2Fimage%2F1%2F200525%2Ftranh-treo-tuong-la-xanh-nhiet-doi-moi-1.jpg&w=256&q=90",
    },
    {
        name: "Tranh theo chủ đề",
        thumbnailImageUrl: "https://lala.com.vn/_next/image?url=https%3A%2F%2Fstc.subi.vn%2Fimage%2F1%2F210524%2Fbo-tranh-treo-tuong-la-nghe-thuat-4-1.jpg&w=256&q=90",
    },
    {
        name: "Tranh theo hình dạng",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/06/1-22-min.jpg",
    },
    {
        name: "Tranh phong cảnh",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/05/dlv-170_53828-min.jpg",
    },
    {
        name: "Tranh nghệ thuật",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/10/tranh-phong-ngu-2-tam-20.jpg",
    },
    {
        name: "Tranh phong thủy",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2022/10/O1CN014dHa1W2EYIazDp5aO_665298756.jpg",
    },
]

const children1Categories = [
    {
        name: "Tranh phòng khách",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/10/O1CN01PYSxh223iPmhC5FNj_2208106727289.jpg",
    },
    {
        name: "Tranh phòng ăn",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/10/O1CN01kCibrX2CqxZMWtOJz_2211371618526.jpg",
    },
    {
        name: "Tranh phòng ngủ",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/11/O1CN018wZiW2255bQN51PBJ_0-item_pic-1.jpg_Q75-1.jpg",
    },
    {
        name: "Tranh cầu thang",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/05/CT-10-min.jpg",
    },
    {
        name: "Tranh quán cà phê",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2019/07/Tranh-Scandinavia-phong-c%C3%A1ch-B%E1%BA%AFc-%C3%82u-SCA1022.jpg",
    },
    {
        name: "Tranh spa",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/05/SPA58-min.jpg",
    },
    {
        name: "Tranh văn phòng",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2022/06/4-min.jpg",
    },
]

const children2Categories = [
    {
        name: "Tranh Phật giáo",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2024/02/tranh-phat-giao-12.jpg",
    },
    {
        name: "Tranh Công giáo",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/10/TCG77_21002.jpg",
    },
    {
        name: "Tranh trẻ em",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/04/tranh-treo-tuong-trang-guong-129.jpg",
    },
]

const children3Categories = [
    {
        name: "Tranh vuông",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/06/1-100-min.jpg",
    },
    {
        name: "Tranh tròn",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2024/01/B.jpg",
    },
    {
        name: "Tranh dọc",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/02/z2344754240411_d939ea64bb994c7e8b62429e0a7c3424-min.jpg",
    },
    {
        name: "Tranh ngang dài",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/09/tranh-phong-ngu-ngang-32.jpg",
    },
]

const children4Categories = [
    {
        name: "Tranh lá cây",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/04/FT66099-min.jpg",
    },
    {
        name: "Tranh cây",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2024/09/tranh-dan-tuong-3-42.jpg",
    },
    {
        name: "Tranh hoa",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2018/06/33873852_175694253268943_8974033272468144128_n-2.jpg",
    },
    {
        name: "Tranh hoa sen",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2024/02/tranh-treo-tuong-phat-giao-5.jpg",
    },
    {
        name: "Tranh tứ quý",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2024/06/10.jpg",
    },
    {
        name: "Tranh đồng quê",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2024/07/tranh-phong-canh-2-1.jpg",
    },
    {
        name: "Tranh động vật",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2024/05/tranh-dan-tuong-2.jpg",
    },
]

const children5Categories = [
    {
        name: "Tranh sơn dầu",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2020/07/1-1.jpg",
    },
    {
        name: "Tranh trừu tượng",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/05/Tranh-treo-tuong-phong-khach-dep-e1720057078610.jpg",
    },
    {
        name: "Tranh đèn LED",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/10/Dong-ho-treo-tuong-led-long-vu.jpg",
    },
    {
        name: "Tranh sắt",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2019/10/z4134074936342_ad64c9f56c3fe957a4d27bb8a83b3e80.jpg",
    },
    {
        name: "Tranh tráng gương",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2024/03/tranh-trang-guong-2.jpg",
    },
    {
        name: "Tranh dát vàng",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/10/100x180-min-1.jpg",
    },
]

const children6Categories = [
    {
        name: "Tranh mã đáo thành công",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2022/10/O1CN014dHa1W2EYIazDp5aO_665298756.jpg",
    },
    {
        name: "Tranh thuận buồm xuôi gió",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2023/10/O1CN013W3Wba1JsyZZbquDw_0-item_pic.jpg_Q75.jpg",
    },
    {
        name: "Tranh sơn thủy hữu tình",
        thumbnailImageUrl: "https://tuongxinh.com.vn/wp-content/uploads/2021/05/dlv-121_36175-min.jpg",
    },
]

async function uploadParentCategories() {
    for (const category of parentCategories) {
        await uploadCategory({ ...category, parentId: null });
    }
}

async function uploadChildrenCategories() {
    let parentCategory = await getOneBySlug("tranh-theo-vi-tri");
    for (const category of children1Categories) {
        await uploadCategory({ ...category, parentId: parentCategory.id });
    }

    parentCategory = await getOneBySlug("tranh-theo-chu-de");
    for (const category of children2Categories) {
        await uploadCategory({ ...category, parentId: parentCategory.id });
    }

    parentCategory = await getOneBySlug("tranh-theo-hinh-dang");
    for (const category of children3Categories) {
        await uploadCategory({ ...category, parentId: parentCategory.id });
    }

    parentCategory = await getOneBySlug("tranh-phong-canh");
    for (const category of children4Categories) {
        await uploadCategory({ ...category, parentId: parentCategory.id });
    }

    parentCategory = await getOneBySlug("tranh-nghe-thuat");
    for (const category of children5Categories) {
        await uploadCategory({ ...category, parentId: parentCategory.id });
    }

    parentCategory = await getOneBySlug("tranh-phong-thuy");
    for (const category of children6Categories) {
        await uploadCategory({ ...category, parentId: parentCategory.id });
    }
}

async function uploadCategory(category) {
    const form = new FormData();
    const file = await changeImageUrlToFile(category.thumbnailImageUrl);

    form.append("image", file);

    // const uploadedImage = await uploadImage(form);

    fetch(`http://localhost:5000/api/upload/image`, {
        method: "POST",
        body: form
    }).then(function (a) {
        return a.json(); // call the json method on the response to get JSON
    }).then(async function (res) {
        const uploadedImageId = res.metadata.id;

        const uploadedCategory = await prisma.category.create({
            data: {
                name: category.name,
                slug: getSlug(category.name),
                parentId: category.parentId,
                thumbnailImageId: uploadedImageId,
            },
        });
        console.log("Uploaded category: ", uploadedCategory);

    })
}

module.exports = { uploadParentCategories, uploadChildrenCategories };