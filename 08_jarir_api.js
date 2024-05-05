import axios from 'axios';
import fs from 'fs';

const apiUrl = 'https://www.jarir.com/api/catalogv1/product/store/sa-ar/category_ids/1339/aggregation/true/size/12/from/12/sort-priority/asc';

// Function to make API request and save response to JSON file
async function saveApiResponseToJson(url) {
    try {
        // Make API request
        const response = await axios.get(apiUrl);

        // Convert response data to JSON
        const jsonData = JSON.stringify(response.data);

        // Write JSON data to file
        fs.writeFileSync('./output/jarir_api.json', jsonData);

        console.log('API response saved to api_response.json');
    } catch (error) {
        console.error('Error occurred while saving API response:', error);
    }
}

// Call the function to save API response to JSON file
saveApiResponseToJson(apiUrl);
