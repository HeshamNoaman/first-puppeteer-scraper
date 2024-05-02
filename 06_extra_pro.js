import { startBrowserAndPage, saveToJson } from './utils/puppeteerUtils.js';

const pageURL = "https://www.extra.com/ar-sa/samsung/c/8021";

const selectors = {
    productLists: '.c_product-tile-d-card > div',
    productUrl: 'a',
    productImg: 'picture > source',
    productPrice: '.c_cart-pricecard .pricecard-details > .pricecard-selling-price > .price',
};


const run = async () => {

    const allowedTypes = ['document', 'script'];

    const { browser, page } = await startBrowserAndPage(pageURL, allowedTypes);


    const allProduct = await page.evaluate((selector) => {

        const productLists = document.querySelectorAll(selector.productLists)

        return Array.from(productLists).map((product, index) => {
            const productName = product.getAttribute('data-name');
            const productUrl = product.querySelector(selector.productUrl).getAttribute('href');
            const productImg = product.querySelector(selector.productImg).getAttribute('srcset');
            const productPrice = product.querySelector(selector.productPrice).textContent;

            return { id: index, productName, productUrl, productImg, productPrice }
        });

    }, selectors);

    saveToJson(allProduct, './output/phone_product.json');

    // Close the browser
    await browser.close();
}


await run();