

const File = require("../models/files");



exports.listFile = async(req, res) => {

    try {
        const id = req.user.googleId;
        const files = await File.find({ Id: id });
        res.status(200).json(files);
      } catch (error) {
        console.log(error);
      }
}