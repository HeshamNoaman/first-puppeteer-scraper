import { startBrowserAndPage, saveToJson } from './utils/puppeteerUtils.js';

const selectors = {
    productLists: 'div.grid.grid-cols-12.gap-4 > div .text-zinc-700',
    title: '.product-text-content > a',
    img: 'img',
    originalPrice: '.product-text-content .text-zinc-400 > span',
    priceAfterDiscount: '.product-text-content .text-red > span',
    footerSection: 'footer.bg-black'
};

// Function to scroll to the bottom of the page
async function autoScroll(page, waitTime) {

    await page.evaluate(async (time) => {

        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;

            var timer = setInterval(() => {

                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, time);
        });

    }, waitTime);
}

async function scrapeLazyLoadedElements(page, scrollDelay) {

    // Scroll to trigger lazy loading
    await autoScroll(page, scrollDelay);

    // get the content of all the product
    const allProduct = await page.$$eval(selectors.productLists, (products, selectors) => {

        return products.map(product => {

            const originalPrice = product.querySelector(selectors.originalPrice);

            return {
                productName: product.querySelector(selectors.title).textContent,
                url: 'https://www.almanea.sa' + product.querySelector(selectors.title).getAttribute('href'),
                photo: product.querySelector(selectors.img).getAttribute('src'),
                originalPrice: originalPrice ? originalPrice.textContent : null,
                priceAfterDiscount: product.querySelector(selectors.priceAfterDiscount).textContent,
            };

        })

    }, selectors);

    return allProduct;
};


const pageURL = "https://www.almanea.sa/mobiles-tablets-c-7423/mobiles-c-7424";
const allowedTypes = ['document', 'stylesheet', 'script', "xhr"];

const { browser, page } = await startBrowserAndPage(pageURL, allowedTypes, true);
const scrollDelay = 100;

await scrapeLazyLoadedElements(page, scrollDelay)
    .then((data) => {
        // display number of saved item
        console.log('total saved items is:', data.length);

        // save the content to json file
        saveToJson(data, './output/almanea_product.json');
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        browser.close();
    });
