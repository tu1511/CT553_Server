const { default: slugify } = require("slugify");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

async function getGenderFromQuery(query) {
  const prisma = require("../config/prismaClient");

  const genderRegex = /(nam|nữ|trẻ em)/i;
  const gender = query.toLowerCase().match(genderRegex)?.at(0);
  if (gender) {
    const genderCategories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
    });

    return genderCategories.find(
      (category) => category.name.toLowerCase() === gender
    );
  }
  return null;
}

const getUrlExtension = (url) => {
  console.log("url", url);
  return url.split(/[#?]/)[0].split(".").pop().trim();
};

const changeImageUrlToFile = async (imgUrl) => {
  var imgExt = getUrlExtension(imgUrl);

  const response = await fetch(imgUrl);
  const blob = await response.blob();
  const file = new File([blob], "categoryImage." + imgExt, {
    type: blob.type,
  });
  return file;
}

const getUploadedImageId = async (imageUrl) => {
  const form = new FormData();
  const file = await changeImageUrlToFile(imageUrl);
  form.append("image", file);

  const uploadedImageId = await fetch(`http://localhost:5000/api/upload/image`, {
    method: "POST",
    body: form
  }).then(function (a) {
    return a.json(); // call the json method on the response to get JSON
  }).then(function (res) {
    const uploadedImageId = res.metadata.id;
    return uploadedImageId;
  });
  return uploadedImageId;
}

const getUploadedImageIds = async (imageUrls) => {
  const form = new FormData();
  await Promise.all(imageUrls.map(async (image) => {
    const file = await changeImageUrlToFile(image);
    form.append("images", file);
  }));

  const uploadedImageIds = await fetch(`http://localhost:5000/api/upload/images`, {
    method: "POST",
    body: form
  }).then(function (a) {
    return a.json(); // call the json method on the response to get JSON
  }).then(function (res) {
    const uploadedImageIds = res.metadata.map((image) => image.id);
    return uploadedImageIds;
  });
  return uploadedImageIds;
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatSlugify = (value) =>
  slugify(value, { lower: true, locale: 'vi' });

module.exports = {
  sortObject,
  getGenderFromQuery,
  changeImageUrlToFile,
  getUploadedImageId,
  getUploadedImageIds,
  formatCurrency,
  formatSlugify,
};
