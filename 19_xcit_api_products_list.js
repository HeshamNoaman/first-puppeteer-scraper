import axios from 'axios';
import { saveToJson, wait } from './utils/puppeteerUtils.js';

const apiKey = 'bc730ee47f433236db145a1a6171bf66';
const appId = 'JSV268MEFD';
const algoliaAgent = 'Algolia for JavaScript (4.11.0); Browser (lite); instantsearch.js (4.57.0); react (17.0.2); react-instantsearch (7.1.0); react-instantsearch-core (7.1.0); next.js (12.1.6); JS Helper (3.14.2)';


// the website url: https://www.xcite.com/ar-KW/mobile-phones/c

const url = `https://jsv268mefd-2.algolianet.com/1/indexes/*/queries?x-algolia-agent=${algoliaAgent}&x-algolia-api-key=${apiKey}&x-algolia-application-id=${appId}`;

let nbPages = 0;
let currentPage = 0;

let nbHits = 0;
// let hitsPerPage = 96;
// let hitsPerPage = 60;
let hitsPerPage = 750;

let extracted_info = [];
let rowData = [];

let data = {

    requests: [
        {
            indexName: "xcite_prod_kw_ar_main",
            params: `analytics=true`
                + `&analyticsTags=["Device_Type_Web_Desktop","Lang_AR"]`
                + `&clickAnalytics=true`
                + `&facetingAfterDistinct=true`
                + `&facets=["*"]`
                + `&highlightPostTag=__/ais-highlight__`
                + `&highlightPreTag=__ais-highlight__`
                + `&hitsPerPage=${hitsPerPage}`
                + `&maxValuesPerFacet=1000`
                + `&page=${currentPage}`
                + `&query=cd6b18ab-c46b-4d90-b9b3-736bd9af29a6`
                // + `&tagFilters=`
        }
    ]
};

function extractData(result) {

    rowData.push(result);

    const domain = 'https://www.xcite.com/ar-KW/';
    
    // add data to extracted_info array
    result.hits.forEach((item) => {

        // const descriptionArray = Object.entries(item.productFeaturesAr).map(([key, value]) => `${key}: ${value}`);

        extracted_info.push({
            productName: item.name,
            price: item.price,
            wasPrice: item.unmodifiedPrice || null,
            currency: item.item,
            available: item.inStock,
            brand: item.brand,
            url: `${domain}${item.slug}/p`,
            // photo: item.productMediaUrls[0],
            // description: descriptionArray,
            // specification: item.specification
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
        console.error(error.message);
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
saveToJson(extracted_info, './output/xcite_product_organized.json');

saveToJson(rowData, './output/xcite_product_raw.json');

// save data to mongodb
// insertProducts(extracted_info);