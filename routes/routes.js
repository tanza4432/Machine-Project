const express = require("express");
const Multer = require("multer");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const {
  login,
  register,
  getalluser,
  uploadImage,
  delImage,
  editImage,
} = require("../controllers/mainController");

const router = express.Router();

router.post("/user/login", login);
router.post("/user/register", register);
router.get("/user", getalluser);
router.post("/uploadimg/:id", multer.single("img"), uploadImage);
router.patch("/user/img/remove/:id/:index", delImage);
router.put("/user/img/:id/:index", multer.single("img"), editImage);

module.exports = {
  routes: router,
};
