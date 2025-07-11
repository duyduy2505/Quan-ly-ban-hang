const categoryMiddleware = require("../../middlewares/client/category.middleware");
const productRouter = require("./product.router");
const homeRouter = require("./home.router");
module.exports = (app) =>{
    app.use(categoryMiddleware);
    app.use('/', homeRouter);
    app.use('/products', productRouter);
};