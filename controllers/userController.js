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
const wishlistModel = require("../models/wishlistModel");

let otp = "";
let count = { cart: 0, wish: 0 };
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
    
    res.render("home", { login: req.session.userLogin, count });
  } catch (error) {
    console.log(error.message);
  }
};
const shop = async (req, res) => {
  try {
    const products = await productModel.find();
    const categories = await categoryModel.find();
    res.render("shop", {
      products,
      categories,
      login: req.session.userLogin,
      count,
    });
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
console.log(items);
let subtotal = Cart.cartItems.map(item => item.total).reduce((acc, val) => acc + val, 0);
      res.render("cart", { items, login: req.session.userLogin, count, subtotal});
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
    const productModel = require("../models/productModel");
    const product = await productModel.findOne({ _id: productId });
    console.log(product);
    console.log(product.price);

    if (userExist) {
      console.log("iiiiiiiiiiiiiiii");
      const productExist = await cartModel.findOne({
        $and: [{ userId }, { cartItems: { $elemMatch: { productId } } }],
      });
      console.log("prdouctExist = ", productExist);

      if (productExist) {
        await cartModel.findOneAndUpdate(
          { $and: [{ userId }, { "cartItems.productId": productId }] },
          {
            $inc: {
              "cartItems.$.quantity": 1,
              "cartItems.$.total": product.price,
            },
          }
        );

        // await cartModel.findOneAndUpdate(
        //    { productId },
        //   { $inc: {"cartitems.$.total" : product.price} }
        // );
      } else {
        await cartModel
          .updateOne(
            { userId },
            {
              $push: {
                cartItems: { productId, quantity: 1, total: product.price },
              },
            }
          )
          .then(() => {
            console.log("jjjjjjjjjjjj");
            res.json({ status: true });
          });
      }
    } else {
      console.log();
      const cartDetails = new cartModel({
        userId: req.session.userId,
        cartItems: [{ productId, quantity: 1, total: product.price }],
      });
      await cartDetails
        .save()
        .then(() => {
          console.log("jjjjjjjjjjjj");
          res.json({ status: true });
        })
        .catch((error) => {
          // console.log(error);
          next(error);
        });
    }
  } catch (error) {
    // console.log(error);
    next(error);
  }
};
const removeCart = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const productId = new mongoose.Types.ObjectId(req.params.id);

    await cartModel
      .updateOne(
        { userId: userId },
        { $pull: { cartItems: { productId: productId } } }
      )
      .then((response) => {
        res.redirect("/cart");
      });
  } catch (error) {
    console.log(error.message);
  }
};
const removeWish = async (req, res, next) => {
  console.log("///////////////////");
  try {
    const productId = req.params.id
    console.log(productId);
    const userId = req.session.userId;
    await wishlistModel
      .updateOne(
        { userId: userId },
        { $pull: { productId: productId }  }
      )
      .then(() => {
        res.json({ remove: true });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const loadWishlist = async (req, res, next) => {
  
  try {
    const userId = req.session.userId;

    let wishlist = await wishlistModel
      .findOne({ userId: userId })
      .populate("productId")
      .lean();

    if (wishlist) {
      let items = wishlist.productId;
      
      res.render("wishlist", { items, login: req.session.userLogin, count });
    }
  } catch (error) {
    console.log(error);
  }
};
const addToWishlist = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    const userWishList = await wishlistModel.findOne({ userId: userId });
    const productid = new mongoose.Types.ObjectId(req.params.id);

    if (userWishList) {
      const productExist = await wishlistModel.findOne({
        $and: [{ userId },{ productId: {  "$all": [ productid ] }}],
      });
      console.log(productExist);

      if (!productExist) {
        await wishlistModel
          .updateOne({ userId: userId }, { $push: { productId: productid } })
          .then(() => {
            res.json({ status: true });
          });
      }
    } else {
      const wishlistData = new wishlistModel({
        userId: userId,
        productId: productid,
      });
      await wishlistData.save().then(() => {
        res.json({ status: true });
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// const cart404 = async (req, res, next) => {
//   try {
//     res.render("cart404");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

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
const changeItemQty = async (req, res, next) => {
  try {
      const userId = req.session.userId
      const itemId = req.body.item
      const productId =  mongoose.Types.ObjectId(req.body.product)
      const change = req.body.change
      const qty = req.body.qty
      const product = await productModel.findById({ _id: productId })
      
      if (change == -1 && qty == 1) {
          await cartModel.updateOne({
              userId: userId
          },
              {
                  $pull: { cartItems: { _id: itemId } }
              }).then(() => {
                  res.json({ remove: true })
              }).catch((error) => {
                  next(error)
              })
      } else {
          await cartModel.findOneAndUpdate(
              {
                  $and:
                      [{ userId: userId },
                      { "cartItems.productId": productId }]
              },
              {
                  $inc:
                      { "cartItems.$.quantity": change, "cartItems.$.total": product.price * change }
              }
          ).then(async () => {
              let priceChange = product.price * change
              console.log(priceChange);
              const Cart = await cartModel.findOne({ userId: userId })
                  .populate('cartItems.productId')
                  .lean();
              const subtotal = Cart.cartItems.map(item => item.total).reduce((acc, val) => acc + val, 0);
              res.json({ status: true, price: priceChange, total:subtotal });
          }).catch((error) => {
              next(error)
          })
      }
  } catch (error) {
      next(error)
  }
}
const countItem = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const cart = await cartModel.findOne({ userId: userId });
    const wish = await wishlistModel.findOne({ userId: userId });
    // ?? nullish operator
    if (cart) {
      count.cart = cart.cartItems.length ?? 0;
    }
    if (wish) {
      count.wish = wish.productId.length ?? 0;
    }
    next();
  } catch (error) {
    next(error);
  }
};
const checkout = async (req, res) => {
  try {
    
    res.render("checkout",{ login: req.session.userLogin, count });
  } catch (error) {
    console.log(error.message);
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
  loadWishlist,
  verifyUser,
  getOtp,
  verifyOtpPage,
  loadCart,
  addToCart,
  // cart404,
  addToWishlist,
  removeCart,
  countItem,
  removeWish,
  changeItemQty,
  checkout,
  

};
