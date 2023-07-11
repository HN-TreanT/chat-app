const User = require("../models/users");
const {
  reponseSuccess,
  responseInValid,
  responseServerError,
  responseSuccessWithData,
} = require("../helper/ResponseRequests");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
const getAll = async (req, res) => {
  let pageSize;
  let page;
  pageSize = req.query.pageSize;
  page = req.query.page;
  if (!req.query.pageSize || !req.query.page) {
    pageSize = 1000;
    page = 1;
  }

  const users = await User.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  return responseSuccessWithData({ res, data: users });
};
const getUserById = async (req, res) => {
  const users = await User.findOne({
    email: req.params.email,
  });
  if (!users) {
    return responseInValid({ res, message: "not found user" });
  }
  return responseSuccessWithData({ res, data: users });
};
const register = async (req, res) => {
  try {
    const users = await User.findOne({
      username: req.body.username,
    });

    if (users) {
      return responseInValid({ res, message: "username exists" });
    }
    const user2 = await User.findOne({ email: req.body.email });
    if (user2) {
      return responseInValid({ res, message: "email exists " });
    }
    const hashPassword = await hashUserPassword(req.body.password);
    const newUsers = new User({
      ...req.body,
      password: hashPassword,
    });

    await newUsers.save();
    return responseSuccessWithData({ res, data: newUsers });
    // const newuser = await User.create()
  } catch (err) {
    return responseServerError({ res, err: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return responseInValid({
        res,
        message: "invalid username or password",
      });
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return responseInValid({ res, message: "user not exist" });
    }
    let check = await bcrypt.compareSync(password, user.password);
    if (check) {
      return responseSuccessWithData({ res, data: user });
    } else {
      return responseInValid({ res, message: "password incorrect" });
    }
  } catch (err) {
    return responseServerError({ res, err: err.message });
  }
};
const getListFriend = async (req, res) => {
  let pageSize;
  let page;
  pageSize = req.query.pageSize;
  page = req.query.page;
  if (!req.query.pageSize || !req.query.page) {
    pageSize = 1000;
    page = 1;
  }
  const friends = await User.find({ friends: req.query.id })
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  return responseSuccessWithData({ res, data: friends });
};
module.exports = {
  getAll,
  register,
  login,
  getUserById,
  getListFriend,
};
