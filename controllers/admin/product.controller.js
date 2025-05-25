//[get] / admin/products
const Product = require('../../models/product.model');
const filterStatushelpers = require('../../helpers/filterStatus');
const searchhelpers = require('../../helpers/search');
const paginationhelpers = require('../../helpers/pagination');
module.exports.index = async(req, res) => {
    const filterStatus = filterStatushelpers(req.query);
    let find ={
    };
    if(req.query.status){
        find.status = req.query.status;
    }
    const objectSearch = searchhelpers(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationhelpers({
        currentPage: 1,
        limitItems: 4
    },
        req.query,
        countProducts
    );
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
    res.render("admin/pages/products/index",{
        pageTitle : "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        query: req.query,
    });
}

module.exports.changeStatus = async(req, res) => {
    console.log(req.params);
    res.send("Change status of product");
}
