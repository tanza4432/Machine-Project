const express = require("express");
const Multer = require("multer");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const { uploadImage } = require("../controllers/mainController");

const router = express.Router();

router.post("/uploadimg", multer.single("img"), uploadImage);

module.exports = {
  routes: router,
};
