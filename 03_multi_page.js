import { startBrowserAndPage } from './utils/puppeteerUtils.js';

// Flag for remaining pages
let isRemainPage = true;
const nextBtnSelector = '.pager > .next > a';

async function getQuotes() {

    const pageURL = "http://quotes.toscrape.com/";
    const allowedTypes = ['document', 'script'];

    const { browser, page } = await startBrowserAndPage(pageURL, allowedTypes);

    let allQuotes = [];

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

        // save the result in array
        allQuotes = allQuotes.concat(quotes);

        // or use the following instead
        /*
        // Check if there is a next button
        try {
            await page.waitForSelector(nextBtnSelector);
        } catch (error) {
            // If next button not found, set isRemainPage to false
            isRemainPage = false;
            console.log("Next button not found. Exiting loop.");
            break;
        }

        // Click next button
        await page.click(nextBtnSelector);
        */

        // ************ another way ************
        // Check if there is a next button
        isRemainPage = !!(await page.$(nextBtnSelector));

        if (!isRemainPage) { break }

        // Click next button
        await page.waitForSelector(nextBtnSelector);
        await page.click(nextBtnSelector);
        // **************************
    }

    console.log("complete loop now exit");
    console.log(allQuotes);
    console.log("the length is: ", allQuotes.length);

    // Close the browser
    await browser.close();
};

getQuotes();

