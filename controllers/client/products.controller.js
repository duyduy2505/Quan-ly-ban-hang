const Product = require("../../models/product.model.js");


// [get]   /products
module.exports.index = async(req, res) => {
    let products = [];
    try {
        products = await Product.find({
            deleted: false,
            status: "active",
        });
    } catch (err) {
        console.error('Lỗi truy vấn:', err);
    }
    const newProducts = products.map(item => {
        item.pricenew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    });
    console.log(newProducts);


    res.render("client/pages/products/index",{
        pageTitle: "Danh Sách Sản phẩm",
        products: newProducts,
    });
    }