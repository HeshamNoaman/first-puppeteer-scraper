import axios from 'axios';
import { saveToJson, startBrowserAndPage } from './utils/puppeteerUtils.js';

const baseUrl = 'https://www.almanea.sa';

// https://www.almanea.sa/mobiles-tablets-c-7423/mobiles-c-7424

let pageNo = 0;
let categoryId = 7424;
let numberOfItem = 60;

const PRODUCTS_URL = `${baseUrl}/api/category/pagination`;

// Make request with obtained cookies
const getCookies = async () => {
    try {
        const allowedTypes = ['document', 'script', "xhr"];

        // Visit the website to get cookies
        const { browser, page } = await startBrowserAndPage(baseUrl, allowedTypes, true);

        // Get cookies from the page
        const cookies = await page.cookies();

        // Close the browser since we have the cookies
        await browser.close();

        // Format cookies for Axios request
        // const formattedCookies = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        // or use this to get only the needed cookie (handshake)
        const handshakeCookie = cookies.find(cookie => cookie.name === "handshake");

        // Get the handshake value if the handshake cookie is found
        const formattedHandshakeCookie = handshakeCookie ? `${handshakeCookie.name}=${handshakeCookie.value}` : null;

        saveToJson(cookies, "./output/cookies.json");

        // return formattedCookies;
        return formattedHandshakeCookie;

    } catch (error) {
        console.log(`Error fetching the data: ${error.message}`);
    }
}

const scrapeAlmanea = async (pageNo, categoryId, numberOfItem, cookies) => {

    const response = await axios.post(
        PRODUCTS_URL,
        {
            pageNo,
            pageSize: numberOfItem,
            categoryID: categoryId,
            currentSortFilterKeys: 'sortBy=position&sortDir=ASC&'
        },
        {
            headers: {
                'accept': 'application/json, text/plain, */*',
                'content-type': 'application/json',
                'cookie': cookies
            }
        }
    );

    const products = response.data;

    return products;
}

const cookies = await getCookies();

if (cookies) {
    const products = await scrapeAlmanea(pageNo, categoryId, numberOfItem, cookies);

    // save the product to json file
    saveToJson(products, "./output/almanea_api_pro.json");
}
