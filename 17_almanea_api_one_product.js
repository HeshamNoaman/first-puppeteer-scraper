import axios from "axios";
import { saveToJson } from "./utils/puppeteerUtils.js";

const rewriteUrl = 'xiaomi-redmi-10-2022-4g-6gb-ram-128gb-sea-blue-p-6110313124'

let productUrl = `https://www.almanea.sa/_next/data/1715693284004/ar/product/${rewriteUrl}.json`;

//  convert the fetch to axios
const response = await axios.get(
    productUrl,
    {
        headers: {
            'cookie': "handshake=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZSI6ImFyIiwic2Vzc2lvbklEIjoiVHNsMHA0eWZ5TUltMzdwVXhsNlRHWVF5SlBjYzhNQWIiLCJpYXQiOjE3MTU5NjkyMDcsImV4cCI6MTcxODU2MTIwN30.FN4Cz3-KYB966ZkAI-_1Kg-Bnv8nIZsn-XW2iWqEDIE"
        }
    }
);

// save the product to json file
saveToJson(response.data, "./output/almanea_api_one.json");
