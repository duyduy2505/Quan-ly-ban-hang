const express = require('express');
const database = require('./config/database.js');
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

route(app);
routeAdmin(app);
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.listen(port, () => {
console.log(`Example app listening on port ${port}`);
});
