const express = require("express");
const router = express.Router();
const { checkGoogleAuth } = require("../controllers/checkGoogleAuth");
const File = require("../models/files");

router.get("/list", checkGoogleAuth, async (req, res) => {
  try {
    console.log("GOGOGO " + req.user.googleId);
    const id = req.user.googleId;
    const files = await File.find({ Id: id });
    res.status(200).json(files);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
