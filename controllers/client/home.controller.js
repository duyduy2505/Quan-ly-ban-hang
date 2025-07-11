const express = require("express");
const product = require("../../models/product.model");
module.exports.index = async(req, res) => {
    const productsFeatured = await product.find(
        {
            featured: "1",
            deleted: false,
            status: "active"
        }).limit(6);
    const newProducts = productsFeatured.map((item) => {
        item.priceNew = (item.price - (item.price * item.discountPercentage / 100)).toFixed(0);
        return item;
    });
    res.render("client/pages/home/index",{
        pageTitle : "Trang chu",
        productsFeatured: newProducts,
    });
}