import axios from 'axios';
import { saveToJson , saveToHtmlFile} from './utils/puppeteerUtils.js';

const categoryUrl = 'https://sa.pricenacdn.com/js/cattree_ar.json';

const CurrentPage = 1;
const CatId = 2;
const productsUrl = `https://sa.pricena.com/ar/search/applyFilter/${CurrentPage}?Keyword=&Brands=&Stores=&Catid=${CatId}&Sticky=1&Minprice=0&Maxprice=0&SpecialQueryID=0&RefineKeywords=&Model=&SortOption=rank&ViewMode=0&Offer=&OutOfStock=1`;

const main = async () => {

  try {
    // make a get request to the category url
    const CatResponse = await axios.get(categoryUrl);

    // save data to json file
    saveToJson(CatResponse.data, "./output/pricena_categories.json");

    // TODO::note get the category id for the CatResponse

    // make a get request to the products url
    const proResponse = await axios.get(productsUrl);

    // save data to html file
    saveToHtmlFile(proResponse.data.products, "./output/pricena_products.html");

  } catch (error) {
    console.log(`error fetching the data ${error.message} `);
    console.log(error.message);
  }

}



await main();