import axios from 'axios';
import { saveToJson, wait } from './utils/puppeteerUtils.js';
import { insertProducts } from "./utils/mongooseUtils.js";

const apiKey = 'af1b13cfdc69ebf18c5980f2c6afff4d';
const appId = 'ML6PM6JWSI';
const algoliaAgent = 'Algolia for JavaScript (4.5.1); Browser (lite)';

// the website url: https://www.extra.com/ar-sa/mobiles-tablets/mobiles/smartphone/c/2-212-3/facet/?q=:relevance:inStock:true&text=&pageSize=48&pg=2&sort=relevance
// https://ml6pm6jwsi-2.algolianet.com/1/indexes/*/queries

const oldDNS = 'ml6pm6jwsi-dsn.algolia.net';
const newDNS = 'ml6pm6jwsi-2.algolianet.com';
const url = `https://${newDNS}/1/indexes/*/queries?x-algolia-agent=${algoliaAgent}&x-algolia-api-key=${apiKey}&x-algolia-application-id=${appId}`;

let nbPages = 0;
let currentPage = 0;

let nbHits = 0;
let hitsPerPage = 96;

let extracted_info = [];
let rowData = [];

let data = {
    requests: [
        {
            indexName: 'prod_sa_product_index',
            query: '',
            params:
                `optionalFilters=["sellingOutFastCities:SA-riyadh<score=5>","inStockCities:SA-riyadh<score=5>"]`
                + `&facetFilters=[["inStock:SA-riyadh_inStock"]]`
                + `&facets=["productFeaturesAr.*", "brandAr", "subFamilyAr", "rating","productStatusAr","price","offersFacet","inStock","hasFreeGifts","familyAr","deliveryFacet"]`
                + `&hitsPerPage=${hitsPerPage}&page=${currentPage}&getRankingInfo=1&clickAnalytics=true&filters=categories:2-212-3`
        },
        {
            indexName: 'prod_sa_product_index',
            query: '',
            params: `hitsPerPage=${hitsPerPage}&responseFields=["facets"]&facets=inStock&filters=categories:2-212-3`,
        },
    ],
};

function extractData(result) {

    rowData.push(result);

    const domain = 'https://www.extra.com';

    // add data to extracted_info array
    result.hits.forEach((item) => {

        const descriptionArray = Object.entries(item.productFeaturesAr).map(([key, value]) => `${key}: ${value}`);

        extracted_info.push({
            productName: item.nameAr,
            price: item.price,
            wasPrice: item.wasPrice || null,
            available: true,
            url: domain + item.urlAr,
            photo: item.productMediaUrls[0],
            description: descriptionArray,
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
"page": 0,
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

saveToJson(rowData, './output/extra_product_raw.json');

// save data to mongodb
// insertProducts(extracted_info);