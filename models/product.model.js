const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const ProductSchema = new mongoose.Schema({
        title:String,
        product_category_id:{
            type: String,
            default: ""
        },
        featured:String,
        description:String,
        price:Number,
        discountPercentage:Number,
        stock: Number,
        thumbnail:String,
        status:String,
        position:Number,

        slug:{
            type: String,
            slug: "title",
            unique: true,
        },
        createBy:{
            account_id:String,
            createAt: {
                type: Date,
                default: Date.now()
            }
        },
        deleted:{
            type: Boolean,
            default: false
        },
        deleteBy:{
            account_id:String,
            deleteAt:Date,
               
        },
        updateBy:[{
            account_id:String,
            updateAt:Date,
        }]
}, {
    timestamps: true,
}
);
const Product = mongoose.model("Products", ProductSchema,"products");

module.exports = Product;