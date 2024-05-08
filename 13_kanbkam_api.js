import axios from 'axios';
import fs from 'fs';
import { saveToJson } from './utils/puppeteerUtils.js';

const productsUrl = `https://supermarket.kanbkam.com/ae/ar/getFilterData?country=ae&local=ar&merchant=amazon&skip=32&page=amazon-deals&inputs=&_=1715142426085`;

const main = async () => {

  try {
    // make a get request to the products url
    const proResponse = await axios.get(productsUrl);

    // save data to html file
    saveToHtmlFile(proResponse.data.html)

  } catch (error) {
    console.log(`error fetching the data ${error.message} `);
    console.log(error.message);
  }

}

// Write the HTML content to a file
function saveToHtmlFile(content) {

  fs.writeFile('./output/kanbkam_products.html', content, (err) => {
    if (err) throw err;
    console.log('HTML file created successfully.');
  });
}

await main();