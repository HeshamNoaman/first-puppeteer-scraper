import puppeteer from "puppeteer";

const url = process.argv[2];

if (!url) {
    throw "Please provide a URL as the first argument";
}

async function run() {

    // Start a Puppeteer session with:
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });

    // Open a new page
    const page = await browser.newPage();

    // On this new page:
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.screenshot({ path: './output/screenshot.png' })

    await browser.close();
}

run();
// run the file like
// node 04_screenshot.js https://github.com/