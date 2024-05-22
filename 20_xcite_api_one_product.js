import axios from "axios";
import { saveToJson } from "./utils/puppeteerUtils.js";

const rewriteUrl = 'apple-iphone-15-pro-max-6-7-inch-512gb-8gb-ram-5g-natural'

let productUrl = `https://www.xcite.com/_next/data/XVlWTKDITsUA1CNdbHuMe/ar-KW/product/${rewriteUrl}.json`;

//  convert the fetch to axios
const response = await axios.get(productUrl);

// save the product to json file
saveToJson(response.data, "./output/xcite_one_product.json");
