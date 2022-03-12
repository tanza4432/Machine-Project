"use strict";

const firebase = require("../db");
const { Account } = require("../models/main");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const firestore = firebase.firestore();

const uploadImage = async (req, res, next) => {
  const folder = "profile";
  const filename = `${folder}/${Date.now()}`;
  const fileupload = bucket.file(filename);
  const file = bucket.file(`profile/${filename.split("/")[1]}`);
  const link =
    "https://firebasestorage.googleapis.com/v0" +
    file.parent.baseUrl +
    "/" +
    file.parent.name +
    file.baseUrl +
    "/profile" +
    "%2F" +
    filename.split("/")[1] +
    "?alt=media";
  const blobStream = fileupload.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
      nane: filename,
    },
  });

  blobStream.on("error", (err) => {
    return res.status(405).json(err);
  });

  blobStream.on("finish", () => {
    return res.status(200).send({ link: link });
  });

  blobStream.end(req.file.buffer);
};

module.exports = {
  uploadImage,
};