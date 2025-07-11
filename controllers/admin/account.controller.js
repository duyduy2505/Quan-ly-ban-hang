const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');
const Role = require("../../models/role.model");
module.exports.index = async(req, res) => {
    let find ={
        deleted: false
    };
    
    const records = await Account.find(find).select("-password -token");
    for (const record of records) {
        const role = await Role.findOne({_id: record.role_id, deleted: false});
        record.role = role;
    }
    res.render("admin/pages/accounts/index",{
        pageTitle : "Danh sách tài khoản",
        records: records
    });
}
module.exports.create = async(req, res) => {
    const roles = await Role.find({deleted: false});
    
    res.render("admin/pages/accounts/create",{
        pageTitle : "Thêm mới tài khoản",
        roles: roles
    });
}
module.exports.createPost = async(req, res) => {
    req.body.password = md5(req.body.password);
    const emailExists = await Account.findOne({email: req.body.email, deleted: false});
    if (emailExists) {
        req.flash("error", "Email đã tồn tại");
        return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    }
    const nameExists = await Account.findOne({fullname: req.body.fullname, deleted: false});
    if (nameExists) {
        req.flash("error", "Họ tên đã tồn tại");
        return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    }
    if(req.file){
        req.body.avatar = `/uploads/${req.file.filename}`;
    }

    const record = new Account(req.body);
    await record.save();
    req.flash("success", "Thêm tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}
module.exports.edit = async(req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    };
    try {
        const data = await Account.findOne(find).select("-password -token");
        const roles = await Role.find({deleted: false});
    res.render("admin/pages/accounts/edit",{
        pageTitle : "Cập nhật tài khoản",
        roles: roles,
        data: data
    });
   } catch (error) {
       req.flash("error", "Có lỗi xảy ra");
       res.redirect(`${systemConfig.prefixAdmin}/accounts`);
   }
}
module.exports.editPatch = async(req, res) => {
    const id = req.params.id;
    const emailExists = await Account.findOne({_id: {$ne: id},  email: req.body.email, deleted: false});
    if (emailExists) {
        req.flash("error", "Email đã tồn tại");
        return res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
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
        {_id: req.params.id},req.body);
    req.flash("success", "Cập nhật tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    
}

