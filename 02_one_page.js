import { startBrowserAndPage } from './utils/puppeteerUtils.js';

const getQuotes = async () => {

    const pageURL = "http://quotes.toscrape.com/";
    const allowedTypes = ['document', 'script'];

    const { browser, page } = await startBrowserAndPage(pageURL, allowedTypes);
    
    // Get page data
    const quotes = await page.evaluate(() => {
        // Fetch the first element with class "quote"
        const quoteList = document.querySelectorAll(".quote");

        return Array.from(quoteList).map((quote) => {
            // Fetch the sub-elements from the previously fetched quote element
            // Get the displayed text and return it
            const text = quote.querySelector(".text").textContent;
            const author = quote.querySelector(".author").textContent;
            // Get all tags element
            const tags = quote.querySelectorAll(".tags .tag");

            // Loop through each tag element and extract text content
            var tagTexts = Array.from(tags).map((tag) => tag.textContent);

            return { text, author, tagTexts }
        });

    });

    // Display the quotes
    console.log(quotes);

    // Get the next button selector
    const nextBtnSelector = '.pager > .next > a';

    // Click next button
    await page.click(nextBtnSelector);

    // Close the browser
    await browser.close();
};

// Start the scraping
getQuotes();