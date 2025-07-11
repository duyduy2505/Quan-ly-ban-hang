const Role = require("../../models/role.model");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.render("admin/pages/roles/index",{
        pageTitle : "Trang nhóm quyền",
        records: records
    });
}


module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.render("admin/pages/roles/create",{
        pageTitle : "Tạo nhóm quyền",
    });
}
module.exports.createPost = async (req, res) => {
    const records = new Role(req.body);
    await records.save();
    res.redirect("/admin/roles");
};

module.exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    await Role.findByIdAndUpdate(id, { deleted: true });
    res.redirect("/admin/roles");
};

module.exports.edit = async (req, res) => {
    try {
        const id  = req.params.id;
    let find = {
        _id: id,
        deleted: false
    };
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
        pageTitle: "Chỉnh sửa nhóm quyền",
        data: data
    });
    }
    catch (error) {
        res.redirect("/admin/roles");
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật nhóm quyền thành công");
        res.redirect("/admin/roles");
    }
    catch (error) {
        req.flash("error", "Cập nhật nhóm quyền thất bại");
        res.redirect("/admin/roles");
    }
};
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
}
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    for(const item of permissions){
        const { id, permissions: perms } = item;
        await Role.updateOne({ _id: id }, { $set: { permissions: perms } });
    }
    req.flash("success", "Cập nhật quyền thành công");   
    res.redirect("/admin/roles/permissions");
};