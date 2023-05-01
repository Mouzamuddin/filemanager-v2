const express = require("express");
const router = express.Router();
const { checkGoogleAuth } = require("../controllers/checkGoogleAuth");

const { listFile } = require("../controllers/listfile");

router.get("/list", checkGoogleAuth, listFile);

module.exports = router;
