import puppeteer from "puppeteer";
import fs from 'fs';
import readline from "readline";


// for stating puppeteer browser and page
async function startBrowserAndPage(pageURL, allowedResourceTypes) {
    // Start a puppeteer session
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        // userDataDir: './data' // to cache data
    });

    // Open a new page
    const page = await browser.newPage();

    // Call the function to optimize page load
    // await optimizePageLoad(page, allowedResourceTypes);

    // Navigate to the signIn page
    await page.goto(pageURL, { waitUntil: "domcontentloaded" });

    return { browser, page };
}

// for optimizing load of page
async function optimizePageLoad(page, allowedResourceTypes) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (allowedResourceTypes.includes(req.resourceType())) {
            req.continue();
        } else {
            req.abort();
        }
    });
}

// save output to json file
function saveToJson(data, filePath) {
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log("all items have been successfully saved in", filePath, "file");
}

const getUserInput = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter the code: ', (code) => {
            rl.close();
            resolve(code);
        });
    });
};


export { startBrowserAndPage, optimizePageLoad, saveToJson, getUserInput };
