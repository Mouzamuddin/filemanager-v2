const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { checkGoogleAuth } = require("../controllers/checkGoogleAuth");
const { uploadFile } = require("../controllers/fileController");
const { downloadFile } = require("../controllers/fileController");

const { deleteFile } = require("../controllers/fileController");


const upload = multer({ dest: "uploads/" });

router.get("/userdata", checkGoogleAuth, (req, res) => {
  const userData = {
    name: req.user.name,
    picture: req.user.picture,
    email: req.user.email,
  };
  res.json(userData);
});

router.post("/", checkGoogleAuth, upload.single("file"), uploadFile);

router.delete("/:key", checkGoogleAuth, deleteFile);

router.get("/:key", checkGoogleAuth, downloadFile);

module.exports = router;
