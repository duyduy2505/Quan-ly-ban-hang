const Product = require("../../models/product.model.js");

module.exports.index = async(req, res) => {
    let products = [];
    try {
        products = await Product.find({
            deleted: false,
            status: "active",
        }).sort({ position: "desc" });
    } catch (err) {
        console.error('Lỗi truy vấn:', err);
    }
    const newProducts = products.map(item => {
        item.pricenew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    });

    res.render("client/pages/products/index",{
        pageTitle: "Danh Sách Sản phẩm",
        products: newProducts,
    });
    }
module.exports.detail = async(req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        };
        product = await Product.findOne(find);
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });
    } catch (err) {
        res.redirect("/product");
    }
}