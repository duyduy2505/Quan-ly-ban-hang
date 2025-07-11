const createTreeHelper = require("../../helpers/createTree");
const ProductCategory = require("../../models/product-category.model");
module.exports = async (req, res, next) => {
    const categories = await ProductCategory.find({deleted: false  });
    const newCategories = createTreeHelper.Tree(categories);
    res.locals.layoutProductCategories = newCategories;
    next();
};
