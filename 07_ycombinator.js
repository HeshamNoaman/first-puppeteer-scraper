import { startBrowserAndPage } from './utils/puppeteerUtils.js';


async function run(pagesToScrape) {

    return new Promise(async (resolve, reject) => {

        try {
            if (!pagesToScrape) {
                pagesToScrape = 1;
            }

            const pageURL = 'https://news.ycombinator.com/';
            const allowedTypes = ['document', 'script'];

            const { browser, page } = await startBrowserAndPage(pageURL, allowedTypes);

            let currentPage = 1;
            let urls = [];

            while (currentPage <= pagesToScrape) {
                const currentPageUrls = await page.evaluate(() => {

                    const items = document.querySelectorAll(".title > .titleline > a");
                    return Array.from(items).map((item) => ({
                        url: item.getAttribute('href'),
                        text: item.textContent
                    }));

                });

                urls = urls.concat(currentPageUrls);

                if (currentPage <= pagesToScrape) {
                    await page.click('a.morelink', { delay: 200 })
                    await page.waitForSelector('.title > .titleline > a')
                }

                currentPage++;
            }

            await browser.close();

            console.log("total items are: ", urls.length);

            return resolve(urls);

        } catch (error) { return reject(error) }


    })
}

run(10).then(console.log).catch(console.error);