import { startBrowserAndPage, saveToJson } from './utils/puppeteerUtils.js';

(async () => {
    const pageURL = "https://example.com";
    const allowedTypes = ['document', 'script', 'image'];

    const { browser, page } = await startBrowserAndPage(pageURL, allowedTypes);

    // Other operations with page or browser

    // Example usage of saveToJson
    const data = { key: 'value' };
    saveToJson(data, './output/output.json');

    // Don't forget to close the browser when you're done
    await browser.close();
})();
