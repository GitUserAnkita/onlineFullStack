const User = require("../model/user");
const Roles = require("../model/role");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const _ = require('lodash')
const crypto = require('crypto')
const nodemailer = require('nodemailer');

require('dotenv').config();
const secrte = process.env.SECRTE
var ObjectId = mongoose.Types.ObjectId

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

exports.upload = multer({ storage: storage });


exports.login = async (req, res) => {
  try {
    const body = req.body;
    User.findOne({ email: body.email, isDeleted: false })
      .then(userData => {
        const hash = bcrypt.compareSync(body.password, userData.password);
        if (!hash) {
          res.status(400).send({ message: "incorrect password" })
        }
        else {
          var token = jwt.sign({ email: userData.email ,id:userData._id}, secrte, {
            expiresIn: "5h" // 1 hr
          });
          res.status(200).send({ message: "Login successfully", data: userData, accessToken: token })
        }
      })
      .catch(err => {
        res.status(400).send({ message: "Incorrect Email ", SubError: err.message })
      })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
};

exports.register = async(req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path;
    }
    const body = req.body;
    const newUser = new User({
      role: body.role,
      name: body.name,
      phone: body.phone,
      Image: imagePath,
      email: body.email,
      password: body.password,
      address: body.address
    })
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.password, salt);
    newUser.password = hash;
   await newUser
      .save()
      .then((result) => {
        res.status(200).send({ message: 'user added successFully ..', data: result });
      })
      .catch((err) => {
        res.status(400).send({
          message: "please Insert Unique Data",
          SubError: err.message,
        });
      });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    await User.find({ isDeleted: false })
      .select("-password")
      .populate("role")
      .populate("address")
      .then((userData) => {
        res.status(200).send({ message: "user data ", data: userData });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.updateUserDetails = (req, res) => {
  try {
    const body = req.body;
    console.log("bodydata = ", body)
    const userData = {
      role: body.role,
      name: body.name,
      phone: body.phone,
      Image: '',
      email: body.email,
      password: body.password,
      address: body.address
    }
    const id = req.query.id;
    if (!ObjectId.isValid(id) && !ObjectId(id)) {
      res.status(400).send({ message: "please insert valid id" })
    }
    else if (Object.keys(body).length === 0 && body.constructor === Object) {
      res.status(400).send({ message: "Data Not Proper Formated..." });
    }
    else {
      try {
        let imagePath = "";
        if (req.file) {
          imagePath = req.file.path;
        }
        User.findOne({ _id: id }).then(userdata => {
          if (!userdata) {
            res.status(400).send({ message: 'user not found' })
          } else {
            if (req.file === undefined) {
              userData.Image = userdata.Image
            } else {
              userData.Image = imagePath
            }
            User.findByIdAndUpdate(id, userData, { new: true }).then(updatedData => {
              res.status(200).send({ message: 'user details updated successfully..', data: updatedData })
            }).catch(err => {
              res.status(400).send({ errMessage: "user not updated ", subError: err.message })
            })
          }
        }).catch(err => {
          res.status(400).send({ message: err.message })
        })

      } catch (err) {
        res.status(400).send({ message: err.message })
      }
    }
  }
  catch (err) {
    res.status(400).send({ message: err.message })
  }

};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const ownerId = req.body.ownerId;

    deletedUserData = {
      isDeleted: true,
      DeletedBy: ''
    }

    if (!ObjectId.isValid(userId)) {
      res.status(400).send({ message: "userId  is not valid" })
    }
    else if (!ObjectId.isValid(ownerId)) {
      res.status(400).send({ message: "ownerId  is not valid" })
    }
    else {
      const ownerData = await User.findById(ownerId);
      if (!ownerData) {
        res.status(400).send({ message: 'owner not found' })
      }
      else {
        deletedUserData.DeletedBy = ownerData._id;
        const userData = await User.findById(userId);
        if (!userData) {
          res.status(400).send({ message: 'user not found' })
        } else {
          if (userData.isDeleted === false) {
            User.findByIdAndUpdate({ _id: userId }, deletedUserData, { new: true }, (error, deleteUser) => {
              if (!deleteUser) {
                res.status(400).send({ message: 'user not deleted' })
              }
              res.status(200).send({ message: 'user deleted successfully' })
            })
          } else {
            res.status(200).send({ message: 'user already deleted' })
          }
        }
      }
    }

  } catch (err) {
    res.status(400).send({ message: err.message })
  }
};

exports.changePassword = async(req,res)=>{
  try{
    const body = req.body;
    const userid = req.params.userid;
    const user = await User.findById(userid);
    if(!user){
      res.status(400).send({
        message:"user not found !"
      })
    }else{
      if(body.new_password !== body.conform_password){
        res.status(400).send({
          message:"conform password not correct !"
        })
      }else{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.new_password, salt);
        bcrypt.compare(body.old_password, user.password, async (err, result) => { 
             if (!result) {
          return res.status(400).json({
            message: "old password is incorrect you are not verify user !",
          });
        }else{
          const updateUser = await User.findByIdAndUpdate(userid,{password:hash},{new:true});
          if(updateUser){
            res.status(200).send({
              message:`password changed ! now your password is ${body.new_password}`
            });
          }else{
            res.status(400).send({
              message:`password not changed  `
            });
          }
        }
         });
      }
    }
  }catch(error){
    res.status(400).send({
      message:"Oops! something went wrong in update profile",
      subError:error.message
    })
  }
}

exports.getAuthToken = async(req,res)=>{
  const token = jwt.sign({},process.env.WEB_SECRET,{expiresIn: "24h"});
  res.status(200).send({
    authToken:token
  });
}