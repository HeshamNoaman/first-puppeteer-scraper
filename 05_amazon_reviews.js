import { startBrowserAndPage, saveToJson, getUserInput } from './utils/puppeteerUtils.js';

const selector = {
    // captcha page element
    captchaInput: 'input[id=captchacharacters]',
    submitBtn: 'button[type=submit]',

    // login page
    emailId: 'input[name=email]',
    password: 'input[name=password]',
    continue: 'input[id=continue]',
    singIn: 'input[id=signInSubmit]',

    // review page 
    allReviews: '#cm-cr-dp-review-list div.review',
    authorName: 'div[data-hook="genome-widget"] span.a-profile-name',
    reviewTitle: '[data-hook=review-title]>span:not([class])',
    reviewDate: 'span[data-hook=review-date]',
};

const getReviews = async () => {

    const singInURL = "https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2FENHANCE-Headphone-Customizable-Lighting-Flexible%2Fdp%2FB07DR59JLP%2F%3Fref_%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0";
    const allowedTypes = ['document', 'script', 'image'];

    const { browser, page } = await startBrowserAndPage(singInURL, allowedTypes);

    // check if the page of captcha page code appear
    const captchaInput = await page.$(selector.captchaInput);
    const isCaptchaPage = !!captchaInput;

    if (isCaptchaPage) {
        const code = await getUserInput();

        // Fill in the Captcha code field
        await captchaInput.type(code)
        // click submit
        await page.click(selector.submitBtn)
        await page.waitForNavigation({ timeout: 60000 }) // Wait for navigation to complete 
    }
    console.log("don solve captcha");

    // Fill in the email field
    await page.waitForSelector(selector.emailId)
    await page.type(selector.emailId, "xonayaf331@lewenbo.com", { delay: 100 })

    await page.click(selector.continue)

    // Fill in the password field
    await page.waitForSelector(selector.password)
    await page.type(selector.password, "xonayaf331@lewenbo.com", { delay: 100 })

    await page.click(selector.singIn)
    await page.waitForNavigation({ timeout: 60000 }) // Wait for navigation to complete

    // now we in the review page
    await page.waitForSelector(selector.allReviews);


    // $$: mean document.querySelectorAll
    const reviewElements = await page.$$(selector.allReviews);

    const reviewsData = await Promise.all(reviewElements.map(async (reviewElement) => {

        const author = await reviewElement.$eval(selector.authorName, (element) => element.textContent);
        const title = await reviewElement.$eval(selector.reviewTitle, (element) => element.textContent);
        const rawReviewDate = await reviewElement.$eval(selector.reviewDate, (element) => element.textContent);

        const datePart = rawReviewDate.split(" on ")[1].trim();

        return { author, title, datePart };
    }));

    // save the result to json file
    saveToJson(reviewsData, "./output/customer_reviews.json")

    // Close the browser
    await browser.close();
}


getReviews();