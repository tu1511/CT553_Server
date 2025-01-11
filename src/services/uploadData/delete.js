
const prisma = require("../../config/prismaClient");

async function deleteCategories() {
    const deleteCategories = await prisma.category.deleteMany()
    return deleteCategories;
}

async function deleteImages() {
    const deleteImages = await prisma.uploadedImage.deleteMany()
    return deleteImages;
}

async function deleteProducts() {
    const deleteProducts = await prisma.product.deleteMany()
    return deleteProducts;
}

module.exports = { deleteCategories, deleteImages, deleteProducts };