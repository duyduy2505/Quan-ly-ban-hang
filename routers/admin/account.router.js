const express = require('express');
const multer = require('multer');
const router = express.Router();
const storageMulter = require('../../helpers/storageMulter');
const upload = multer({storage: storageMulter()}); 
const controller = require('../../controllers/admin/account.controller');

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', upload.single('avatar'), controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.single('avatar'), controller.editPatch);

module.exports = router;


