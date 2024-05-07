import axios from 'axios';
import { saveToJson } from './utils/puppeteerUtils.js';

// make a get request to :  then save the result to json file

const apiUrl = 'https://sa.pricenacdn.com/js/cattree_ar.json';

const main = async () => {

  try {
    // make a get request to the api url
    const response = await axios.get(apiUrl);

    // save data to json file
    saveToJson(response.data, "./output/pricena_categories.json");

  } catch (error) {
    console.log(`error fetching the data ${error.message} `);
  }

}

await main();