import mongoose from "mongoose";
import Product from "./product.js";

// for remote uri provide your url
import uri from "../output/config.js";

// local uri
const localUri = 'mongodb://localhost:27017';

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

// to search for product by its name
const searchProductsByName = async (productName) => {
    try {
        // connect to mongodb
        await mongoose.connect(uri, options);

        // Use a regular expression to perform a case-insensitive search
        const regex = new RegExp(productName, 'i');
        const products = await Product.find({ productName: regex }).sort({ price: 1 });


        return products;

    } catch (error) {
        console.error('Error searching for products:', error.message);
        throw error;
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }

}




export { insertProducts, searchProductsByName }
