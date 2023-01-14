const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const db = require("../config/connection");
const bcrypt = require("bcrypt");
const session = require("express-session");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const cartModel = require("../models/cartModel");
const sendOtp = require("../utils/nodemailer");
const { render } = require("../routes/userRoute");
let otp = "";
const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};
const insertUser = async (req, res, next) => {
  console.log(req.body);
  try {
    // const bc=await bcrypt.hash(req.body.password,10)
    req.session.email = req.body.email;

    const userdata = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      confirmpassword: req.body.pass,
      is_admin: 0,
    });
    await userdata
      .save()

      .then(() => {
        next();
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/register");
      });
  } catch (error) {
    next(error);
  }
};
// if (userData){
//     res.render('home')
//     // res.send('hello')
// } else{
//     res.render('registration',{message:'your registration failed'})
//     // res.send('helhiiiiilo')

// }

const home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};
const shop = async (req, res) => {
  try {
    const products = await productModel.find();
    const categories = await categoryModel.find();
    res.render("shop", { products, categories });
  } catch (error) {
    console.log(error.message);
  }
};
const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
const doLogin = async (req, res) => {
  console.log(">>>>>");
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    const user = await userModel.findOne({
      $and: [{ email: email }, { status: "Unblocked" }],
    });
    // console.log(user);
    if (!user) {
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.redirect("/login");
    }
    req.session.userId = user._id;
    req.session.userLogin = true;
    console.log(req.session);
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};
const singleProdetails = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id });
    res.render("singleprodetails", { product });
  } catch (error) {
    console.log(error.message);
  }
};
const wishList = async (req, res) => {
  try {
    // const id = req.params.id
    //    const product =await  productModel.findOne({ _id: id })
    res.render("wishlist");
  } catch (error) {
    console.log(error.message);
  }
};
const loadCart = async (req, res, next) => {
  console.log("777777777777777777");
  try {
    const userId = req.session.userId;

    let Cart = await cartModel
      .findOne({ userId: userId })
      .populate("cartItems.productId")
      .lean();
    console.log(Cart);
    if (Cart) {
      let items = Cart.cartItems;
      res.render("cart", { items });
    }
  } catch (error) {
    console.log(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    console.log(">>>>>>>>>>>>>>>>>>>>>>");
    const productId = new mongoose.Types.ObjectId(req.params.id);

    const userId = new mongoose.Types.ObjectId(req.session.userId);
    console.log(userId);
    // const userData = await userModel.findById({_id:userId});
    const userExist = await cartModel.findOne({ userId });
    if (userExist) {
      console.log("iiiiiiiiiiiiiiii");
      const productExist = await cartModel.findOne({
        $and: [{ userId }, { cartItems: { $elemMatch: { productId } } }],
      });
      console.log("prdouctExist = ", productExist);

      if (productExist) {
        await cartModel.findOneAndUpdate(
          { $and: [{ userId }, { "cartItems.productId": productId }] },
          { $inc: { "cartItems.$.quantity": 1 } }
        );
      } else {
        await cartModel.updateOne(
          { userId },
          { $push: { cartItems: { productId, quantity: 1 } } }
        );
      }
    } else {
      console.log();
      const cartDetails = new cartModel({
        userId: req.session.userId,
        cartItems: [{ productId, quantity: 1 }],
      });
      await cartDetails
        .save()
        .then(() => {
          // res.render('cart');
        })
        .catch((err) => {
          res.render("cart404");
        });
    }
  } catch (error) {
    res.redirect("/cart404");
  }
};
const cart404 = async (req, res, next) => {
  res.render("cart404");
};

const verifyOtpPage = async (req, res) => {
  try {
    res.render("verify");
  } catch (error) {
    next();
  }
};
const getOtp = async (req, res, next) => {
  let email = req.session.email;
  otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  await sendOtp
    .sendVerifyEmail(email, otp)
    .then(() => {
      res.redirect("/verify");
    })
    .catch((error) => {
      next(error);
    });
};

const verifyUser = async (req, res, next) => {
  console.log(">>>>>>>>>>>>>>");
  console.log(req.body);
  try {
    if (req.body.otp == otp) {
      // console.log("both otp equal");
      // console.log(req.session);
      await userModel
        .findOneAndUpdate(
          { email: req.session.email },
          { $set: { verified: true } }
        )
        .then(() => {
          otp = "";
          res.redirect("/");
        })
        .catch((error) => {
          next(error);
        });
    } else {
      console.log("otp doesnt match");
      return res.redirect("/verify");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  home,
  loadLogin,
  doLogin,
  shop,
  singleProdetails,
  wishList,
  verifyUser,
  getOtp,
  verifyOtpPage,
  loadCart,
  addToCart,
  cart404,
};
