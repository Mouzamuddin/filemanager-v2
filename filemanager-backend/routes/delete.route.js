const express = require("express");
const router = express.Router();

const { deleteFile } = require("../controllers/fileController");

const { checkGoogleAuth } = require("../controllers/checkGoogleAuth");

router.delete("/:key", checkGoogleAuth, deleteFile);

module.exports = router;
