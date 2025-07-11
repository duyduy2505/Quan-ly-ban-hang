const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard.router");
const productRouter = require("./product.router");
const productCategoryRouter = require("./product-category.router");
const roleRouter = require("./role.router");
const accountRouter = require("./account.router");
const authRouter = require('./auth.router');
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const myAccountRouter = require("./my-account.router");


module.exports = (app) =>{
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN +'/dashboard',authMiddleware.requireAuth ,dashboardRouter);
    app.use(PATH_ADMIN +'/products', authMiddleware.requireAuth ,productRouter);
    app.use(PATH_ADMIN +'/products-category', authMiddleware.requireAuth ,productCategoryRouter);
    app.use(PATH_ADMIN +'/roles', authMiddleware.requireAuth ,roleRouter);
    app.use(PATH_ADMIN +'/accounts', authMiddleware.requireAuth ,accountRouter);
    app.use(PATH_ADMIN +'/auth', authRouter);
    app.use(PATH_ADMIN +'/my-accounts', authMiddleware.requireAuth ,myAccountRouter);
}