import axios from 'axios';
import * as cheerio from "cheerio";
import { saveToHtmlFile, saveToJson } from './utils/puppeteerUtils.js';

// abdulwahed selectors
const abdulwahedSelectors = {
    productsCount: "div.product-count > h3",
    productUrl: ".product-item-info > a",
    brand: "div.pdp-brand-container > span:nth-child(2)",
    productName: ".product-info-main div h2",
    description: "div.product.attribute.overview > div > p",
    alternativeDescription: "div.product.attribute.overview > div > div",
    // .relative.w-full img:nth-child(2)
    photo: "div.fotorama__stage__frame.fotorama__active.fotorama_vertical_ratio.fotorama__loaded.fotorama__loaded--img > img",
    price: '.price-wrapper[data-price-type="finalPrice"]',
    wasPrice: '.price-wrapper[data-price-type="oldPrice"]',
    available: "div.product-info-price > div > div > h3 > span",
    Specification: "#product-attribute-specs-table > tbody > tr > td > table > tbody > tr",
}

// Function to extract all products URLs
async function fetchCurrentPageData(currentPage, limit) {

    const url = `https://www.abdulwahed.com/ar/computers-mobiles.html?p=${currentPage}&product_list_limit=${limit}`;
    const headers = { headers: { 'X-Requested-With': 'XMLHttpRequest' } };
    const body = 'isAjax=1';

    try {
        // Fetch HTML content
        const response = await axios.post(url, body, headers);
        const html = response.data.products;

        // Load HTML content into Cheerio
        const $ = cheerio.load(html);

        // get all products url
        const productsUrls = $(abdulwahedSelectors.productUrl);

        // save the content of href
        const urlsList = productsUrls.map((i, el) => $(el).attr('href')).get();

        // get the number of products
        const productsCount = $(abdulwahedSelectors.productsCount).text().match(/\d+/)[0];

        let pagesCount = 0;
        // calculate the number of page base on the number of product divided by products per page
        if (productsCount) {
            pagesCount = Math.ceil(productsCount / limit);
        }

        console.log(`Fetched products from page ${currentPage} / ${pagesCount}`);
        console.log(`total products fetched are ${urlsList.length} \n`);

        return {
            urlsList,
            pagesCount,
            productsCount
        };

    } catch (error) {
        console.error('Error:', error);
    }
}

async function getAllProductsUrl() {
    // initialize needed var
    let currentPage = 1;
    const limit = 72;
    let numberOfProducts = 0;
    let totalPages = 0;
    let allProductsUrl = [];

    do {
        // initial request to get the number of products and pages
        const { urlsList, pagesCount, productsCount } = await fetchCurrentPageData(currentPage, limit);

        totalPages = pagesCount;
        numberOfProducts = productsCount;

        // save data
        allProductsUrl = allProductsUrl.concat(urlsList);

        currentPage++;

    } while (currentPage <= totalPages);

    console.log(`total product count in api ${numberOfProducts}`);
    console.log(`total product scrapped ${allProductsUrl.length}`);

    return allProductsUrl;
}


// Call the function and log the extracted image URLs
getAllProductsUrl()
    .then(result => {
        saveToJson(result, 'productsUrl.json');
    })
    .catch(error => {
        console.error('Error:', error);
        saveToJson(error, 'error.json');
    });