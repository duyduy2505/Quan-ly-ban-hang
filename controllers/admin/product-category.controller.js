const ProductCategory = require("../../models/product-category.model");
const systemConfig = require('../../config/system');
const createTree = require("../../helpers/createTree");

module.exports.index = async(req, res) => {
    let find ={
        deleted: false
    };
    
    const records = await ProductCategory.find(find);
    const newRecords = createTree.Tree(records,"");

    res.render("admin/pages/products-category/index",{
        pageTitle : "Danh mục sản phẩm",
        records: newRecords
    });
}

module.exports.create = async(req, res) => {
    let find ={
        deleted: false
    };
    const records = await ProductCategory.find(find);
    const newRecords = createTree.Tree(records,"");
    res.render("admin/pages/products-category/create",{
        pageTitle : "Tạo danh mục sản phẩm",
        records: newRecords,
    });
}

module.exports.createPost = async(req, res) => {
    if(req.body.position== ""){
        const count = await ProductCategory.countDocuments();
        req.body.position = count+1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const records = new ProductCategory(req.body);
    await records.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}
module.exports.edit = async(req, res) => {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
        _id : id,
        deleted: false
    });

    let find ={
        deleted: false
    };
    const records = await ProductCategory.find(find);
    const newRecords = createTree.Tree(records,"");
    res.render("admin/pages/products-category/edit",{
        pageTitle : "Chỉnh sửa danh mục sản phẩm",
        records: newRecords,
        data: data
    });
    
}
module.exports.editPatch = async(req, res) => {
    const id = req.params.id;
    if(req.body.parent_id == "data.parent_id"){
        req.body.parent_id ="";
    }
    req.body.position = parseInt(req.body.position);

    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    await ProductCategory.updateOne({_id: id}, { $set: req.body });
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}