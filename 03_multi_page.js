import { startBrowserAndPage } from './utils/puppeteerUtils.js';

// Flag for remaining pages
let isRemainPage = true;
const nextBtnSelector = '.pager > .next > a';

async function getQuotes() {

    const pageURL = "http://quotes.toscrape.com/";
    const allowedTypes = ['document', 'script'];

    const { browser, page } = await startBrowserAndPage(pageURL, allowedTypes);

    // Loop to get quotes until there are no more next buttons
    while (isRemainPage) {
        // Get page data
        const quotes = await page.evaluate(() => {
            // Fetch the first element with class "quote"
            const quoteList = document.querySelectorAll(".quote");

            // Map each quote element to an object containing its text, author, and tags
            return Array.from(quoteList).map((quote) => {
                const text = quote.querySelector(".text").textContent;
                const author = quote.querySelector(".author").textContent;
                const tagsElement = quote.querySelectorAll(".tags .tag");

                // Loop through each tag element and extract text content
                const tags = Array.from(tagsElement).map(tag => tag.textContent);

                return { text, author, tags };
            });

        });

        // Display the quotes
        console.log(quotes);

        // Click next button
        await page.waitForSelector(nextBtnSelector);
        await page.click(nextBtnSelector);

        // Check if there is a next button
        const nextBtn = await page.$(nextBtnSelector);
        isRemainPage = !!nextBtn;
        console.log("next btn: ", nextBtn, " is remain: ", isRemainPage);
    }

    console.log("complete loop now exit");
    // Close the browser
    await browser.close();
};

getQuotes();

