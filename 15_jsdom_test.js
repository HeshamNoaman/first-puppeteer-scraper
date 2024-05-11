import { JSDOM } from "jsdom";
import axios from "axios";



async function scrapeQuote() {
    try {
        // Fetch the HTML content of url
        // https://www.imdb.com/chart/top/
        const response = await axios.get('http://quotes.toscrape.com/');
        const html = response.data;

        // Parse the HTML using jsdom
        const dom = new JSDOM(html);

        // Extract the quote titles
        const titleElements = dom.window.document.querySelectorAll('.quote .text');
        const quoteTitles = [];

        // Iterate over the title elements and extract the text
        titleElements.forEach(titleElement => {
            quoteTitles.push(titleElement.textContent.trim());
        });

        // print it into the console
        console.log(quoteTitles);

    } catch (error) {
        console.error('Error scraping', error);
    }
}

scrapeQuote();
