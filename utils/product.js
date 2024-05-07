import mongoose from "mongoose";

// const Schema = mongoose.Schema;
// the same
const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    // shorthand of {type: Number}
    wasPrice: Number,
    available: {
        type: Boolean,
        default: true
    },
    description: {
        type: Array,
        require: true
    },

});

// compiling our schema into a Model
const Product = mongoose.model('product', productSchema);

// default export used to export one thing and you have the freedom to choose the desired name when imported
export default Product;