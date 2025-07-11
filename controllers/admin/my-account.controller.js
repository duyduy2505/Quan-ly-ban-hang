const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
module.exports.index = async(req, res) => {
    res.render("admin/pages/my-account/index",{
        pageTitle : "Thông tin tài khoản",
    });
}
module.exports.edit = async(req, res) => {
    res.render("admin/pages/my-account/edit",{
        pageTitle : "Thông tin tài khoản",
    });
}
module.exports.editPatch = async(req, res) => {
    const id = res.locals.user.id;
    const emailExists = await Account.findOne({_id: {$ne: id},  email: req.body.email, deleted: false});
    if (emailExists) {
        req.flash("error", "Email đã tồn tại");
        res.redirect(`${systemConfig.prefixAdmin}/my-accounts/edit`);
    }
    if(req.body.password){
        req.body.password = md5(req.body.password);
    } else {
        delete req.body.password;
    }
    if(req.file){
        req.body.avatar = `/uploads/${req.file.filename}`;
    }
    await Account.updateOne(
        {_id: id},req.body);
    req.flash("success", "Cập nhật tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/my-accounts`);
}