import axios from 'axios';
import { saveToJson, wait } from './utils/puppeteerUtils.js';

const apiKey = 'af1b13cfdc69ebf18c5980f2c6afff4d';
const appId = 'ML6PM6JWSI';
const algoliaAgent = 'Algolia%20for%20JavaScript%20(4.5.1)%3B%20Browser%20(lite)';

const url = `https://ml6pm6jwsi-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=${algoliaAgent}&x-algolia-api-key=${apiKey}&x-algolia-application-id=${appId}`;

let nbPages = 0;
let currentPage = 1;

let nbHits = 0;
let hitsPerPage = 48;

let extracted_info = [];

let data = {
    requests: [
        {
            indexName: 'prod_sa_product_index',
            query: '',
            params: `optionalFilters=%5B%22sellingOutFastCities%3ASA-riyadh%3Cscore%3D5%3E%22%2C%22inStockCities%3ASA-riyadh%3Cscore%3D5%3E%22%5D`
                + `&facetFilters=%5B%5B%22inStock%3ASA-riyadh_inStock%22%5D%5D&facets=%5B%22productFeaturesAr.*%22%2C%22brandAr%22%2C%22subFamilyAr%22%2C%22rating`
                + `%22%2C%22productStatusAr%22%2C%22price%22%2C%22offersFacet%22%2C%22inStock%22%2C%22hasFreeGifts%22%2C%22familyAr%22%2C%22deliveryFacet%22%5D`
                + `&hitsPerPage=${hitsPerPage}&page=${currentPage}&getRankingInfo=1&clickAnalytics=true&filters=categories%3A2-212-3`,
        },
        {
            indexName: 'prod_sa_product_index',
            query: '',
            params: `hitsPerPage=${hitsPerPage}&responseFields=%5B%22facets%22%5D&facets=inStock&filters=categories%3A2-212-3`,
        },
    ],
};

function extractData(result) {

    const domain = 'https://www.extra.com';

    // add data to extracted_info array
    result.hits.forEach((item) => {

        let indexNo = extracted_info.length + 1;

        extracted_info.push({
            number: indexNo,
            indexTime: item.indexTime,
            productName: item.nameAr,
            priceAfterDiscount: item.price,
            originalPrice: item.wasPrice || "",
            available: true,
            url: domain + item.urlAr,
            photo: item.productMediaUrls[0],
            description: item.productFeaturesAr,
        });

    });
}

async function fetchCurrentPageData() {
    try {
        const response = await axios.post(url, data);

        // get the data from the response
        const response_data = response.data.results[0];

        // extract the data
        extractData(response_data);

        // get the number of hits from the response
        nbHits = response_data.nbHits;

        // get the number of pages from the response
        nbPages = response_data.nbPages;
        console.log(`fetch page ${currentPage} of total ${nbPages}`);
    } catch (error) {
        console.error(error);
    }
}


/*
make a run function to make more than on request until get all data
base on the following data get it from the first request:
"nbHits": 452,
"page": 1,
"nbPages": 10,
"hitsPerPage": 48,
*/
async function run() {
    while (nbPages > currentPage) {
        currentPage++;

        // Update the page value in the request parameters
        data.requests[0].params = data.requests[0].params.replace(/page=\d+/, `page=${currentPage}`);

        console.log('Loading ....................');

        // call the function to make a request
        await fetchCurrentPageData();

        // Add a delay between fetches
        await wait(1000);
    }
}


// get the first request data
await fetchCurrentPageData();
console.log(`Number of Hits are ${nbHits}`);

// get the rest of the data
await run();

// save the modified response to json file
saveToJson(extracted_info, './output/extra_product_organized.json');
