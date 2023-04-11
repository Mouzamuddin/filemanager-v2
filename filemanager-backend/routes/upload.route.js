const express = require("express");
const File = require("../models/files");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const { checkGoogleAuth } = require("../controllers/checkGoogleAuth");
const bucketName = "mswfilemanager";
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const awsBucketName= process.env.AWS_BUCKET_NAME
const s3 = new AWS.S3({
  //accessKeyId: "AKIAVUH22ESRR6J3JIWM",
  accessKeyId: accessKeyId,
  //endpoint: 's3.amazonaws.com',
  // secretAccessKey: "xWBsz/CBRzir7ABwEQ9t7GjAzB1Vl0mr5gIbWk0E",
  // region: "ap-south-1",
  secretAccessKey: secretAccessKey,
  region:region,
});

const upload = multer({ dest: "uploads/" });



router.get("/userdata", checkGoogleAuth, (req, res) => {
  console.log("AAAAAAAA");
  const userData = {
    name: req.user.name,
    picture: req.user.picture,
    email: req.user.email,
  };
  res.json(userData);
});

router.post("/", checkGoogleAuth, upload.single("file"), (req, res) => {
  console.log("upload req");
  console.log(req.user.googleId);
  if (req.file == null) {
    return res.status(400).json({ message: "Please choose the file" });
  }

  var file = req.file;

  const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: awsBucketName,
    Key: file.originalname,
    Body: fileStream,
  };
  s3.upload(params, function (err, data) {
    console.log("s3Upload data");
    console.log(data);
    if (err) {
      throw err;
    }
    new File({
      _id: new mongoose.Types.ObjectId(),
      Id: req.user.googleId,
      path: data.Location,
      filename: file.originalname,
    })
      .save()
      .then((newFile) => {
        console.log("uploaded new file: ", newFile);
        res.send(200);
        //done(null, newFile);
      });
    console.log(`File uploaded successfully. ${data.Location}`);
  });
  //    res.send(200)
});

module.exports = router;
