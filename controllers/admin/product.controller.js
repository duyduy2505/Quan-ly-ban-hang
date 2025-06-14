//[get] / admin/products
const Product = require('../../models/product.model');
const systemConfig = require('../../config/system');
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
    const products = await Product.find(find).
    sort({position: "desc"}).
    limit(objectPagination.limitItems).
    skip(objectPagination.skip);
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
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect("/admin/products");
}
module.exports.changeMulti = async(req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    console.log(type, ids);
    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"});
            req.flash("success", `Cập nhật trạng thái thành công (${ids.length}) sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
            req.flash("success", `Cập nhật trạng thái thành công (${ids.length}) sản phẩm`);
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}}, {deleted: true, deletedAt: new Date()});
            req.flash("success", `Xóa thành công (${ids.length}) sản phẩm`);
            break;
        case "change-position":
            for(const item of ids){
                let[id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {position: position});
                req.flash("success", `Cập nhật vị trí thành công (${ids.length}) sản phẩm`);
            }
        default:
            break;
    }
    res.redirect("/admin/products");
}
module.exports.deleteItem = async(req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id}, {deleted: true, deletedAt: new Date()});
    req.flash("success", "Xóa thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

module.exports.create = async(req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Tạo sản phẩm mới",
    });
}

module.exports.createPost = async(req, res) => {
    
    req.body.price= parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position== ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts+1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);

}

module.exports.edit = async(req, res) => {
    try {
    const id = req.params.id;
    const find = {
        deleted: false,
        _id: id
    };
    const product = await Product.findOne(find);
    console.log(product);
    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product
    });
} catch (error) {
    req
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

module.exports.editPatch = async(req, res) => {
    const id = req.params.id;
    req.body.price= parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    await Product.updateOne({_id: id}, req.body);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    try {
        await Product.updateOne({_id: id}, req.body);
    } catch (error) {
        req.flash("danger", "Cập nhật sản phẩm thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

module.exports.detail = async(req, res) => {
    try {
    const find = {
        deleted: false,
        _id: req.params.id
    };
    const product = await Product.findOne(find);
    console.log(product);
    res.render("admin/pages/products/detail", {
        pageTitle: `Chi tiết sản phẩm ${product.title}`,
        product: product
    });
} catch (error) {
    req.flash("danger", "Không tìm thấy sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}