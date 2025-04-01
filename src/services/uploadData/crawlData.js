const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const getProduct = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });
  console.log("Capturing");

  const html = await page.evaluate(() => document.querySelector("*").outerHTML);
  const $ = cheerio.load(html);

  let jewelryData = {
    name: "",
    overview: "",
    images: [],
    description: "",
    category: "",
    color: "",
    material: "",
    stone: "",
    gender: "",
    completion: "",
  };

  // get name
  jewelryData.name = $(
    $(
      ".product_title.entry-title.elementor-heading-title.elementor-size-default"
    )
  )
    .text()
    .trim();

  // get price
  let prices = [];

  // Lấy tất cả các giá có thể có trên trang
  $("#purchase_now > div > div > div > div > div > div > p > span > bdi").each(
    (i, element) => {
      let priceText = $(element).text().replace(/\D/g, ""); // Loại bỏ ký tự không phải số
      if (priceText) {
        prices.push(Number(priceText)); // Chuyển sang kiểu số và thêm vào mảng
      }
    }
  );

  // Nếu không có giá, đặt giá mặc định là 0
  if (prices.length === 0) {
    prices.push(0);
  }

  // get size
  let sizes = ["Size 1", "Size 2", "Size 3"];

  // merge size and price into variants
  const variants = [];
  for (let i = 0; i < sizes.length; i++) {
    variants.push({
      size: sizes[i],
      price: prices[0] + i * 50000,
    });
  }
  jewelryData.variants = variants;

  // get description
  // chu y elementor-element-666b9ac0
  jewelryData.description = $(
    "div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-7101208f.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div"
  )
    .html()
    ?.trim();

  jewelryData.overview = $("div.product-short-description > p").text().trim();

  // get thumbnail image and images
  let tempArray = $("div.woocommerce-product-gallery__image.slide")
    .map((i, element) => $(element).attr("data-thumb"))
    .get()
    .map((url) => url.replace(/-150x150/, "-768x768"));

  console.log("tempArray", tempArray);
  jewelryData.images = tempArray;

  // get category, stone, color, gender, material, completion
  $("div.text-ittbdtct").map((i, element) => {
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

  await browser.close();

  return jewelryData;
};

const getAllProductLinks = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });
  console.log("Get all product links");

  const html = await page.evaluate(() => document.querySelector("*").outerHTML);
  const $ = cheerio.load(html);

  let links = [];
  $("div.product-small.box > div.box-image > div.image-zoom_in > a").each(
    async (i, element) => {
      let link = $(element).attr("href");
      links.push(link);
    }
  );
  await browser.close();
  links = links.slice(10, 16);
  console.log("links", links);
  return links;
};

module.exports = {
  getProduct,
  getAllProductLinks,
};
