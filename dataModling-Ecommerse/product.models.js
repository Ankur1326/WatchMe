import Mongoose from "mongoose";

const productSchema = new Mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        default: 0,
        type: Number
    },
    stock: {
        default: 0,
        type: Number
    },
    category: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
}, {timestamps: true})

export const Product = Mongoose.model("Product", productSchema)