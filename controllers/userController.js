const userModel =require('../models/userModel');
const mongoose = require("mongoose")
const db=require('../config/connection')
const bcrypt = require("bcrypt");
const session = require("express-session");
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');

const loadRegister =async(req,res)=>{
    try{
    res.render('registration')
    

} catch(error){
    console.log(error.message);
}
}
const insertUser = async(req,res)=>{
    console.log(req.body);
    try{
    // const bc=await bcrypt.hash(req.body.password,10)

    const userdata =new userModel({
        name:req.body.name,
        email:req.body.email,
        password:await bcrypt.hash(req.body.password,10),
        confirmpassword:req.body.pass,
        is_admin:0
        


    })
    const userData =await userdata.save()
    if (userData){
        res.render('home')
        // res.send('hello')
    } else{
        res.render('registration',{message:'your registration failed'})
        // res.send('helhiiiiilo')

    }

    

    }catch(error){
        console.log(error.message);
    }

}
const home =async(req,res)=>{
    try{
    res.render('home')
    

} catch(error){
    console.log(error.message);
}
}
const shop =async(req,res)=>{
    try{
        const products = await productModel.find()
       const categories = await categoryModel.find()
    res.render('shop',{products,categories})
    

} catch(error){
    console.log(error.message);
}
}
const loadLogin =async(req,res)=>{
    try{
    res.render('login')
    

} catch(error){
    console.log(error.message);
}
}
const doLogin =async(req,res)=>{
    console.log(">>>>>");
    try {
        const { email, password } = req.body;
        // console.log(req.body);
        const user = await userModel.findOne({ $and:[{  email: email  },{ status: "Unblocked" }]});
        // console.log(user);
        if (!user) {
          return res.redirect('/login');
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
          return res.redirect('/login');
        }
        // req.session.user = user.name
        // req.session.userId = user._id
        // req.session.userLogin = true;
        // console.log(req.session);
        res.redirect('/');
  
      } 
    
    


catch (error){
    console.log(error.message);
}
}
const singleProdetails = async (req, res) => {
    try {
      res.render("singleprodetails");
    } catch (error) {
      console.log(error.message);
    }
  };
  


module.exports={
    loadRegister,
    insertUser,
    home,
    loadLogin,
    doLogin,
    shop,
    singleProdetails,
}