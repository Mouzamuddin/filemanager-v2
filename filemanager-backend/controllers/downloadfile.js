const AWS = require('aws-sdk');
//const s3 = new AWS.S3();
const s3 = new AWS.S3({
    accessKeyId: 'AKIAVUH22ESRQC73UNI4',
    secretAccessKey: '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',
});

const BUCKET_NAME = 'mswfilemanager';


exports.downloadFile = async (req, res) => {
  const { key } = req.params;

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    const fileContent = data.Body;
    const fileName = key;

    res.set({
      'Content-Disposition': `attachment; filename=${fileName}`,
      'Content-Type': data.ContentType,
    });

    res.send(fileContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error downloading file from S3' });
  }
};