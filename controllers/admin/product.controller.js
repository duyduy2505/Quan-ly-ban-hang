//[get] / admin/products
const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');
const filterStatushelpers = require('../../helpers/filterStatus');
const searchhelpers = require('../../helpers/search');
const paginationhelpers = require('../../helpers/pagination');
const createTreehelpers = require("../../helpers/createTree");
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

    let sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc"; 
    }
    const products = await Product.find(find).
    sort(sort).
    limit(objectPagination.limitItems).
    skip(objectPagination.skip);
    for(const item of products){
            const user = await Account.findOne({_id: item.createBy.account_id});
            console.log(user);
            if(user){
                item.accountFullName = user.fullname;
            }

        const updateBy = item.updateBy.slice(-1)[0];
        if(updateBy){
            const userUpdated = await Account.findOne({
                _id: updateBy.account_id
            });
            updateBy.accountFullName = userUpdated.fullname;
        }
    }

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
    await Product.updateOne({_id: id}, {status: status,
        $push: {
            updateBy: {
                account_id: res.locals.user.id,
                updateAt: new Date()
            }
        }
    });
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect("/admin/products");
}
module.exports.changeMulti = async(req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",").map(id => id.trim()).filter(id => id);
    console.log(ids);
    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active" ,
                $push: {
                updateBy: {
                    account_id: res.locals.user.id,
                    updateAt: new Date()
                }
             }
             });
            req.flash("success", `Cập nhật trạng thái thành công (${ids.length}) sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive",
                $push: {
                updateBy: {
                    account_id: res.locals.user.id,
                    updateAt: new Date()
                }
             }
            });
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
                await Product.updateOne({_id: id}, {position: position ,
                    $push: {
                    updateBy: {
                        account_id: res.locals.user.id,
                        updateAt: new Date()
                    }
                 }
                });
                req.flash("success", `Cập nhật vị trí thành công (${ids.length}) sản phẩm`);
            }
        default:
            break;
    }
    res.redirect("/admin/products");
}
module.exports.deleteItem = async(req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id}, {deleted: true,
        deleteBy:{
            account_id: res.locals.user.id,
            deleteAt: new Date(),
        }
    });
    req.flash("success", "Xóa thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

module.exports.create = async(req, res) => {
    let find = {
        deleted: false,
    }
    const category = await ProductCategory.find(find);
    const newCategory = createTreehelpers.Tree(category);
    res.render("admin/pages/products/create", {
        pageTitle: "Tạo sản phẩm mới",
        category: newCategory
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
    req.body.createBy = {
        account_id: res.locals.user.id,
        createAt: new Date()
    };

    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);

}

module.exports.edit = async(req, res) => {
    try {
    const find = {
        deleted: false,
        _id: req.params.id
    };

    const product = await Product.findOne(find);
    const category = await ProductCategory.find({deleted: false});
    const newCategory = createTreehelpers.Tree(category);
    console.log(product);   
    res.render("admin/pages/products/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product,
        category: newCategory
    });
} catch (error) {
    req.flash("danger", "Không tìm thấy sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

module.exports.editPatch = async(req, res) => {
    const id = req.params.id;

    const updateData = {
        title: req.body.title,
        product_category_id: req.body.product_category_id,
        description: req.body.description,
        price: req.body.price,
        discountPercentage: req.body.discountPercentage,
        stock: req.body.stock,
        featured: req.body.featured,
        slug: req.body.slug,
        status: req.body.status,
        position: req.body.position
    };

    if (req.file) {
        updateData.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne(
            { _id: id },
            {
                $set: updateData,
                $push: {
                updateBy: {
                    account_id: res.locals.user.id,
                    updateAt: new Date()
                }
                }
            }
            );
        req.flash("success", "Cập nhật sản phẩm thành công");
    } catch (error) {
        req.flash("danger", "Cập nhật sản phẩm thất bại");
    }

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};


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