const express = require('express');
const database = require('./config/database.js');
const methodOverride = require('method-override');
const bodyParser = require('body-parser')
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
require('dotenv').config();


const route = require('./routers/client/index.router.js');
const routeAdmin = require('./routers/admin/index.router.js');
const systemConfig = require('./config/system.js');
database.connect();
const app = express();
const port = process.env.PORT;
app.set("views", "./views");
app.use(express.static("public"));
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('DUYDDUYDDUYD'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());


route(app);
routeAdmin(app);
app.locals.prefixAdmin = systemConfig.prefixAdmin;



app.listen(port, () => {
console.log(`Example app listening on port ${port}`);
});
