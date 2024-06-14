import axios from "axios";
import { saveToJson } from "./utils/puppeteerUtils.js";

const rewriteUrl = 'apple-iphone-15-pro-max-6-7-inch-256gb-8gb-ram-5g-white-1'

// Rqth9ikVqejiAgY3yYhpR
let productUrl1 = `https://www.xcite.com/_next/data/rEZoSFedURJ13gaLDCUVY/ar-KW/product/${rewriteUrl}.json`;

try {
    //  convert the fetch to axios
    const response = await axios.get(productUrl);
    
    // save the product to json file
    saveToJson(response.data, "./output/xcite_one_product.json");

} catch (err) {
    saveToJson(err, "./output/xcite_error.json");
}
