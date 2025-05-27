//[get] / admin/products
const Product = require('../../models/product.model');
const filterStatushelpers = require('../../helpers/filterStatus');
const searchhelpers = require('../../helpers/search');
const paginationhelpers = require('../../helpers/pagination');
module.exports.index = async(req, res) => {
    const filterStatus = filterStatushelpers(req.query);
    let find ={
        deleted: false
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
    const id = req.params.id;
    const status = req.params.status;
    await Product.updateOne({_id: id}, {status: status});
    const query = req.query;
    let queryString = '';
    if (Object.keys(query).length > 0) {
        queryString = '?' + new URLSearchParams(query).toString();
    }
    res.redirect("/admin/products");
}
module.exports.changeMulti = async(req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    console.log(type, ids);
    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"});
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
            break;
        default:
            break;
    }
    res.redirect("/admin/products");
}
module.exports.deleteItem = async(req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id}, {deleted: true, deletedAt: new Date()});
    res.redirect("/admin/products");
};