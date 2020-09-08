import multer from "multer";
import path from "path";
import crypto from "crypto";

module.exports = {
  dest: path.resolve(__dirname, "..", "public", "tmp", "uploads"),
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, "..", "public", "tmp", "uploads"));
    },
    filename: (req, file, callback) => {
      var fileObj = {
        "image/png": ".png",
        "image/jpeg": ".jpeg",
        "image/jpg": ".jpg",
        "application/pdf": ".pdf",
      };
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err);

        const FileName = `${req.session.user.id}-${hash.toString("hex")}${
          fileObj[file.mimetype]
        }`;

        callback(null, FileName);
      });
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "application/pdf",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      return callback(new Error("Arquivo invalido"));
    }
  },
};
