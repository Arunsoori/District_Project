const multer = require("multer");


const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/webp": "webp"
  };
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error("invalid image type");
  
      if (isValid) {
        uploadError = null;
      }
      cb(uploadError, "./public/uploads");
    },
    filename: async function (req, file, cb) {
      // console.log(file);
      const filename = file.originalname.split(" ").join("-");
      const extension = await FILE_TYPE_MAP[file.mimetype];
      cb(null, `${filename}-${Date.now()}.${extension}`);
      // console.log(`${filename}-${Date.now()}.${extension}`);
    },
  });

  module.exports = {storage}