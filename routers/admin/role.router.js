const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/role.controller');

router.get('/', controller.index);

router.get('/create', controller.create);
router.post('/create', controller.createPost);
router.get('/delete/:id', controller.deleteItem);
router.get('/edit/:id', controller.edit);
router.post('/edit/:id', controller.editPatch);
router.get('/permissions', controller.permissions);
router.patch('/permissions', controller.permissionsPatch);
module.exports = router;
