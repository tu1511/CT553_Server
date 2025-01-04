const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const fs = require('fs');

const getProduct = async (url) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    console.log("Capturing")

    const html = await page.evaluate(() => document.querySelector('*').outerHTML);
    const $ = cheerio.load(html);

    await page.screenshot({ path: 'screenshot.jpg' });

    let jewelryData = {
        name: "",
        price: "",
        description: "",
        thumbnailImage: "",
        images: [],
        category: "",
        color: "",
        material: "",
        stone: "",
        gender: "",
        completion: "",
    }

    // get name
    jewelryData.name = $('.product_title.entry-title.elementor-heading-title.elementor-size-default').text().trim();

    // get price
	jewelryData.price = $("#purchase_now > div > div > div > div > div > div > p > span > bdi").text().replace(/\D/g, '');

    // get description
    jewelryData.description = $('div.product-short-description > p').text().trim();

    // get images
    let tempArray = [];
    tempArray = $('div.woocommerce-product-gallery__image.slide').map((i, element) => $(element).attr('data-thumb')).get();
    jewelryData.images = tempArray;

    // get thumbnail image
    jewelryData.thumbnailImage = tempArray[0];

    // get category, stone, color, gender, material, completion
    $('div.text-ittbdtct').map((i, element) => {
        if (i == 0) {
            jewelryData.category = $(element).text().trim();
        } else if (i == 1) {
            jewelryData.stone = $(element).text().trim();
        } else if (i == 2) {
            jewelryData.color = $(element).text().trim();
        } else if (i == 3) {
            jewelryData.gender = $(element).text().trim();
        } else if (i == 4) {
            jewelryData.material = $(element).text().trim();
        } else if (i == 5) {
            jewelryData.completion = $(element).text().trim();
        }
    });

    return jewelryData;
}

// const url = "https://lili.vn/san-pham/day-chuyen-doi-bac-dinh-da-cz-hinh-ca-voi-va-buom-brenna-lili_123985/";
const url = "https://lili.vn/san-pham/nhan-doi-bac-dinh-da-cz-all-of-love-lili_614281/";

getProduct(url).then(data => {
    console.log(data);
    fs.writeFile('data.txt', JSON.stringify(data), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data written successfully to', 'data.txt');
        }
    });
});
