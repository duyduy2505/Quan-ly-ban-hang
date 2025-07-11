const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require('../../config/system');
module.exports.login = async(req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } 
    else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập"
        });
    }
}
module.exports.loginPost = async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Account.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Tài khoản không tồn tại");
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    if( md5(password) !== user.password ) {
        req.flash("error", "Mật khẩu không chính xác");
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    if( user.status != "active" ) {
        req.flash("error", "Tài khoản đã bị khóa");
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    res.cookie("token",user.token);

    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);

}
module.exports.logout = async(req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}