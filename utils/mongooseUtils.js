import mongoose from "mongoose";
import Product from "./product.js";

import auth from "../output/config.js";

// local uri
const localUri = 'mongodb://localhost:27017';

// for remote uri provide your it here
const uri = `mongodb+srv://:${auth}:${auth}@myatlasclusteredu.tizay0s.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU`

const options = {
    dbName: 'productDB', // Specify the database name
};

// make function to save the data products data to mongodb
const insertProducts = async (products) => {
    try {
        // connect to mongodb
        await mongoose.connect(uri, options);

        // insertMany record into employee
        const insertedProducts = await Product.insertMany(products);

        // print the number of row inserted
        console.log(`${insertedProducts.length} products inserted successfully.`);

    } catch (error) {
        console.error('Error saving data to MongoDB:', error.message);

    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}


export { insertProducts }
