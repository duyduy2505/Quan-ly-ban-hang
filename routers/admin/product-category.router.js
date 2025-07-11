const express = require('express');
const multer = require('multer');
const router = express.Router();
const storageMulter = require('../../helpers/storageMulter');
const upload = multer({storage: storageMulter()}); 

const controller = require('../../controllers/admin/product-category.controller');
const validate = require('../../validates/admin/product-category.validate');

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', upload.single('thumbnail'),
    validate.createPost,
    controller.createPost
);
module.exports = router;
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.single('thumbnail'),
    validate.editPatch,
    controller.editPatch
);