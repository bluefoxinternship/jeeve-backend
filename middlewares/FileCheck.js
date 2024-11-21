const path = require("path");
const fs = require("fs");

module.exports.fileCheck = (req, res, next) => {
  console.log(req.file?.product_image);
  console.log(req.file);
  if (req.files?.property_image) {
    const file = req.files.property_image;
    const validExts = [".jpg", ".jpeg", ".png"];
    if (validExts.includes(path.extname(file.name))) {
      file.mv(`./upload/${file.name}`, (err) => {
        if (err) {
        }
        req.property_image = `/upload/${file.name}`;

        return next();
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: `please provide valid image`,
      });
    }
  } else {
    return res.status(400).json({
      status: "error",
      message: `please provide image`,
    });
  }
};