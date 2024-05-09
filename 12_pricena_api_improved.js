import axios from "axios";
import fs from "fs";
import * as cheerio from 'cheerio';
import { saveToJson } from './utils/puppeteerUtils.js';

const CurrentPage = 1;
const CatId = 2;

const categoryUrl = 'https://sa.pricenacdn.com/js/cattree_ar.json';

const productsUrl = `https://sa.pricena.com/ar/search/applyFilter/${CurrentPage}?Keyword=&Brands=&Stores=&Catid=${CatId}&Sticky=1&Minprice=0&Maxprice=0&SpecialQueryID=0&RefineKeywords=&Model=&SortOption=rank&ViewMode=0&Offer=&OutOfStock=1`;

async function getHtml(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

// Write the HTML content to a file
function saveToHtmlFile(content, filePath = './output/pricena_products.html') {

    fs.writeFile(filePath, content, (err) => {
        if (err) throw err;
        console.log("HTML file created successfully, saved in", filePath);
    });
}

// firstly save a category to json file
getHtml(categoryUrl).then(data => {
    // save data to json file
    saveToJson(data, "./output/pricena_categories.json");
});


let allProducts = [];

// second get the product html data
getHtml(productsUrl).then(data => {

    const productsHtml = data.products;

    // save data to html file
    saveToHtmlFile(productsHtml);

    // load the content of html to cheerio
    const $ = cheerio.load(productsHtml);

    // loop throw all the elements with class item
    $('.item').each((index, element) => {

        const url = $(element).find('.product-thumbnail a').attr('href');

        const image = $(element).find('.product-thumbnail img').attr('data-src');

        // get the product name
        const productName = $(element).find('.caption .name > h2 > a').text();

        // get best price
        const bestPrice = $(element).find('.caption .price a').text().trim();

        // get only the first store not all of them
        // get the name of the store
        const storeName = $(element).find('.suggested-offer > .so-row .suggested-store-name').first().text();


        // save the product to array
        allProducts.push({ index: (index + 1), url, image, productName, bestPrice, storeName });
    });

    // save all products to json file
    saveToJson(allProducts, "./output/pricena_products.json");

});