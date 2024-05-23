import axios from 'axios';
import * as cheerio from "cheerio";
import { saveToHtmlFile, saveToJson } from './utils/puppeteerUtils.js';

// Selectors for scraping Abdulwahed product pages
const abdulwahedSelectors = {
    productsCount: "div.product-count > h3",
    productUrl: ".product-item-info > a",
    brand: "div.pdp-brand-container > span:nth-child(2)",
    productName: ".product-info-main div h2",
    description: "div.product.attribute.overview div.value",
    price: '.price-wrapper[data-price-type="finalPrice"]',
    wasPrice: '.price-wrapper[data-price-type="oldPrice"]',
    available: "div.product-info-price > div > div > h3 > span",
    specification: "#product-attribute-specs-table > tbody > tr > td > table > tbody > tr",
};

// Function to calculate and log execution time of a given function
function logExecutionTime(startTime) {
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime} milliseconds`);
}

// Function to convert text to number
function convertTextToNumber(text) {
    // Clean the text to extract the number
    const cleanedText = text.split("‏")[1].split(".")[0].replace(",", "");
    return parseFloat(cleanedText);
}

// Function to extract image URLs from the script tag
function extractImageUrls(scriptTagContent) {
    // Parse JSON content inside the script tag
    const imageData = JSON.parse(scriptTagContent);
    return imageData['[data-gallery-role=gallery-placeholder]']['mage/gallery/gallery']['data'].map(item => item['img']);
}

// Function to extract product description
function extractDescription($, selector) {
    const description = [];
    $(selector).each((i, element) => {
        const $element = $(element);
        // Select p and div tags with right-aligned text
        const elements = $element.find('p[style="text-align: right;"], div[style="text-align: right;"]');
        elements.each((i, el) => {
            // Replace <br> tags with newline characters
            $(el).find('br').replaceWith('\n');
            // Split the text by newline, trim whitespace, and filter out empty lines
            const text = $(el).text().split('\n').map(line => line.trim()).filter(line => line);
            description.push(...text);
        });
    });
    return description;
}

// Function to extract product specifications
function extractSpecification($, selector) {
    const specification = [];
    $(selector).each((index, element) => {
        const tds = $(element).find("td");
        if (tds.length === 2) {
            const key = $(tds[0]).text().trim();
            const value = $(tds[1]).text().trim();
            specification.push({ [key]: value });
        }
    });
    return specification;
}

// Scrape the product information from the given URL
async function extractProductInfo(url) {
    const startTime = new Date();
    try {
        // Fetch HTML content
        const { data } = await axios.get(url);
        saveToHtmlFile(data, 'pageContent.html');
        const $ = cheerio.load(data);

        // Extract image URLs from the script tag
        const scriptTagContent = $('div.gallery-placeholder').next('script[type="text/x-magento-init"]').html();
        const imageUrls = extractImageUrls(scriptTagContent);

        // Extract product information
        const productName = $(abdulwahedSelectors.productName)?.text()?.trim() ?? null;
        const brand = $(abdulwahedSelectors.brand)?.text()?.trim() ?? null;
        const price = $(abdulwahedSelectors.price).length ? convertTextToNumber($(abdulwahedSelectors.price).text().trim()) : 0;
        const wasPrice = $(abdulwahedSelectors.wasPrice).length ? convertTextToNumber($(abdulwahedSelectors.wasPrice).text().trim()) : 0;
        const available = $(abdulwahedSelectors.available).text().trim() === "متوفر";
        const specification = extractSpecification($, abdulwahedSelectors.specification);
        const description = extractDescription($, abdulwahedSelectors.description);

        logExecutionTime(startTime);

        return {
            productName,
            url,
            imageUrls,
            brand,
            price,
            wasPrice,
            available,
            description,
            specification,
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// URL of the HTML page
const url = "https://www.abdulwahed.com/ar/apple-iphone-15-128-gb-5g-mtmh3ah-a.html";
// const url = "https://www.abdulwahed.com/ar/sandisk-extreme-pro-sdhctm-and-sdxctm-uhs-i-card-for-dslr-mirrorless-cameras-sdsdxxu-064g-gn4in.html";
// const url = "https://www.abdulwahed.com/ar/apple-iphone-14-plus-yellow-128gb-mr603ah-a.html";
// const url = "https://www.abdulwahed.com/ar/samsung-galaxy-a24-128gb-silver-sm-a245fzsumea.html";
// const url = "https://www.abdulwahed.com/ar/samsung-galaxy-a54-5g-128gb-black-sm-a546ezkcmea.html";

// Call the function and log the extracted image URLs
extractProductInfo(url)
    .then(productInfo => {
        saveToJson(productInfo, 'pageContent.json');
    })
    .catch(error => {
        saveToJson({ error: error.message }, 'error.json');
    });
