const express = require('express');
const router = express.Router();
const { downloadFile } = require('../controllers/downloadfile')

router.get('/download/:key',downloadFile);

module.exports = router;

