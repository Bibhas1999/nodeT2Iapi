import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import T from "tesseract.js";
import fs from 'fs'
class UserController {
  static getUser = async (req, res) => {
    console.log(req.cookies.jwtoken);
    const users = await User.find();
    if (users) {
      return res.send({ users: users, status: "200 ok" });
    }
    return res.send({ msg: "No Users Found", status: "404 Not Out" });
  };

  static addUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const result = await User.findOne({ email: email });
      if (!result) {
        let hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
          token: "fggdgsgsgsgsgs$mffjf",
        });
        await user.save();
        return res.send({ msg: "User Added Successfully", status: "200 OK" });
      }
      return res.send({ msg: "Email already exists", status: "400" });
    } catch (error) {
      console.log(error);
      return res.send({ error: error, status: "500" });
    }
  };

  static editUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: id });
      if (user) {
        console.log(user._id);
        const filtered = {
          id: user._id,
          name: user.name,
          email: user.email,
          active: user.active,
        };
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send({ user: filtered, status: "200 ok" });
      }
      return res.send({ msg: "User Not Found", status: "400 Not Found" });
    } catch (error) {
      console.log(error);
      return res.send({ error: error, status: "500" });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const { id, name, email } = req.body;
      const user = await User.findOne({ email: email });
      console.log(user);
      if (user) {
        await UserModel.updateOne({ name: name, email: email });
        return res.send({ msg: "User Updated Successfully", status: "200 ok" });
      } else {
        return res.send({ msg: "User Not Found", status: "400 Not Found" });
      }
    } catch (error) {
      return res.send({ error: error, status: "500" });
    }
  };

  static uploadPic = async (req, res) => {
    let text = "";
    if (req.file) {
      console.log(req.file)
      return res.send(req.file)
      await T.recognize("/server/public/uploads/" + req.file.filename, "eng", {
        logger: (e) => console.log(e),
      }).then((res) => text=res.text);
      fs.unlinkSync("/server/public/uploads/" + req.file.filename)
      return res.send({
        text:text
      }); 
    }
  };
  static removePic = async (req, res) => {
    if (req.file) {
      return res.send({
        name: req.file.filename,
      });
    }
  };
  static deleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      if (typeof id != "undefined") {
        await User.findByIdAndDelete(id);
        return res.send({ msg: "User Deleted Successfully", status: "200 ok" });
      }
    } catch (error) {
      return res.send({ error: error, status: "500" });
    }
  };
}
export default UserController;
