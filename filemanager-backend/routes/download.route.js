const express = require("express");
const router = express.Router();

const { downloadFile } = require("../controllers/fileController");
const { checkGoogleAuth } = require("../controllers/checkGoogleAuth");

router.get("/:key", checkGoogleAuth, downloadFile);

module.exports = router;
