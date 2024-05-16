import axios from 'axios';
import { saveToJson } from './utils/puppeteerUtils.js';

// https://www.almanea.sa/mobiles-tablets-c-7423/mobiles-c-7424;

const productsUrl = "https://www.almanea.sa/_next/data/1715693284004/ar/mobiles-tablets-c-7423/mobiles-c-7424.json?categoryParent=mobiles-tablets-c-7423&categoryChild=mobiles-c-7424";

const main = async () => {

    try {
        // make a get request to the products url
        const proResponse = await axios.get(productsUrl);

        saveToJson(proResponse.data.pageProps, "almanea_api_only.json");

    } catch (error) {
        console.log(`error fetching the data ${error.message} `);
        console.log(error.message);
    }

}


await main();