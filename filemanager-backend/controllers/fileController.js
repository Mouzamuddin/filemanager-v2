const mongoose = require("mongoose");

const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const File = require("../models/files");

const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const awsBucketName = process.env.AWS_BUCKET_NAME;
const s3 = new AWS.S3({
  accessKeyId: accessKeyId,

  secretAccessKey: secretAccessKey,
  region: region,
});

//const upload = multer({ dest: "uploads/" });

exports.uploadFile = async (req, res) => {
  // console.log(req.user.googleId);
  // console.log(req);
  if (req.file == null) {
    return res.status(400).json({ message: "Please choose the file" });
  }

  var file = req.file;

  const fileStream = fs.createReadStream(file.path);
  // console.log(`${req.user.googleId}/${file.originalname}`);
  const fileName = `${req.user.googleId}/${file.originalname}`;

  // console.log(fileName);
  const params = {
    Bucket: awsBucketName,
    Key: fileName,
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
        // console.log("uploaded new file: ", newFile);
        res
          .status(200)
          .json({ success: true, message: "Successfully Uploaded" });
        fs.unlinkSync(file.path);

        console.log("Delete File successfully.");
        //done(null, newFile);
      });
    // console.log(`File uploaded successfully. ${data.Location}`);
  });
};

exports.downloadFile = async (req, res) => {
  const key = req.params.key;

  const fileName = `${req.user.googleId}/${key}`;
  const params = {
    Bucket: awsBucketName,
    Key: fileName,
  };

  try {
    const data = await s3.getObject(params).promise();
    const fileContent = data.Body;
    // const fileName = key;

    res.set({
      ContentDisposition: `attachment; filename=${key}`,
      "Content-Type": data.ContentType,
    });
    // console.log(data);
    // console.log(fileContent);
    res.send(fileContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error downloading file from S3" });
  }
};

exports.deleteFile = async (req, res) => {
  const key = req.params.key;
  const fileName = `${req.user.googleId}/${key}`;
  const params = {
    Bucket: awsBucketName,

    Key: fileName,
  };

  try {
    await s3.deleteObject(params).promise();

    const name = req.params.key; // or wherever you get the filename from

    File.findOneAndDelete({ filename: name, Id: req.user.googleId })
      .then((deletedFile) => {
        // console.log("deleted file: ", deletedFile);

        res
          .status(200)
          .json({ success: true, message: "Successfully Deleted" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, message: err });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting file from S3" });
  }
};
