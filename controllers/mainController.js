"use strict";

const firebase = require("../db");
const { Account } = require("../models/main");
const firestore = firebase.firestore();
const storage = require("../storage");
const bucket = storage.bucket();
var md5 = require("md5");

const login = async (req, res, next) => {
  const send = req.body;
  const hashPassword = md5(send.password);
  const account = await firestore
    .collection("account")
    .where("email", "==", send.email)
    .where("password", "==", hashPassword);

  const data = await account.get();
  if (data.empty) {
    return res.status(404).send(false);
  } else {
    return res.status(200).send(data.docs[0].data());
  }
};

const register = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data.firstname);
    const hashPassword = md5(data.password);
    const newdata = {
      firstname: data.firstname,
      lastname: data.lastname,
      status: data.status,
      email: data.email,
      address: data.address,
      date_or_birth: data.date_or_birth,
      password: hashPassword,
      img: [],
    };

    await firestore.collection("account").doc().set(newdata);
    res.status(200).send("เพิ่มบัญชีสำเร็จ");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getalluser = async (req, res, next) => {
  try {
    const account = await firestore.collection("account");
    const data = await account.get();
    const AccountArray = [];
    if (data.empty) {
      res.status(404).send("ไม่พบข้อมูลใด");
    } else {
      data.forEach((doc) => {
        const account = {
          id: doc.id,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          email: doc.data().email,
          address: doc.data().address,
          status: doc.data().status,
          date_or_birth: doc.data().date_or_birth,
          image: doc.data().image,
        };
        AccountArray.push(account);
      });
      res.status(200).send(AccountArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const uploadImage = async (req, res, next) => {
  const id = req.params.id;
  const folder = "image";
  const filename = `${folder}/${Date.now()}`;
  const fileupload = bucket.file(filename);
  const file = bucket.file(`image/${filename.split("/")[1]}`);
  const link =
    "https://firebasestorage.googleapis.com/v0" +
    file.parent.baseUrl +
    "/" +
    file.parent.name +
    file.baseUrl +
    "/image" +
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

  blobStream.on("finish", async () => {
    const account = await firestore.collection("account").doc(id);
    const data = await account.get();
    var result = data.data();
    result.image.push(link);
    await account.update(result);
    return res.status(200).send(result);
  });

  blobStream.end(req.file.buffer);
};

const delImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const index = req.params.index;
    const data = req.body;

    const Account = firestore.collection("account").doc(id);
    const Room = await Account.get();

    var result = Room.data();
    result.image.splice(index, 1);

    await Account.update(result);

    res.status(200).send("อัพเดตข้อมูลสำเร็จ");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const editImage = async (req, res, next) => {
  const id = req.params.id;
  const index = req.params.index;
  const folder = "image";
  const filename = `${folder}/${Date.now()}`;
  const fileupload = bucket.file(filename);
  const file = bucket.file(`image/${filename.split("/")[1]}`);
  const link =
    "https://firebasestorage.googleapis.com/v0" +
    file.parent.baseUrl +
    "/" +
    file.parent.name +
    file.baseUrl +
    "/image" +
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

  blobStream.on("finish", async () => {
    const account = await firestore.collection("account").doc(id);
    const data = await account.get();
    var result = data.data();
    result.image[index] = link;
    await account.update(result);
    return res.status(200).send(result);
  });

  blobStream.end(req.file.buffer);
};

module.exports = {
  login,
  register,
  getalluser,
  uploadImage,
  delImage,
  editImage,
};
