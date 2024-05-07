import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { searchProductsByName } from "./utils/mongooseUtils.js";
import express from "express";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for fetching products based on search input
app.get('/api/products', (req, res) => {
    const searchText = req.query.search.trim();

    // call the search function 
    searchProductsByName(searchText)
        .then(products => {
            console.log(`number of found products are ${products.length}`);
            res.json(products);
        })
        .catch(error => {
            console.error('Error:', error.message)
            res.status(500).json({ error: 'Internal server error' });
        })
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


/*


// eg: 'ايفون 15'
const searchText = await getUserInput();
saveToJson(products, 'search_result.json');
import { getUserInput, saveToJson } from "./utils/puppeteerUtils.js";
*/