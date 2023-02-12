// const adminModel =require('../models/adminModel');
const mongoose = require("mongoose");
const db = require("../config/connection");
const bcrypt = require("bcrypt");
const session = require("express-session");
const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");
const couponModel = require("../models/couponModel");
const bannerModel = require("../models/bannerModel");
const excelJS = require("exceljs");
const writeXlsxFile = require('write-excel-file/node')

const productModel = require("../models/productModel");
const fs = require("fs");
const { findById, find } = require("../models/adminModel");
const orderModel = require("../models/orderModel");
const Chart = require('chart.js');
let orderdata ={}



const loadLogin = async (req, res,next) => {
  try {
    res.render("login");
  } catch (error) {
    next(error)
  }
};
const loadDashboard = async (req, res) => {
  try {
    let users = await userModel.find();
    let orders = await orderModel.find()
    let categories = await categoryModel.find()
    let products = await productModel.find()
    let salesData = await orderModel.find({order_status:'placed'})
    


    

    
    let salesChartDt = await orderModel.aggregate([
      {
        $match: { order_status: 'placed' }
      },
      {
        $group: {
          _id: { day: { $dayOfWeek: "$ordered_date" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    
    let SalesCount = []
    for(let i =1 ; i< 8 ;i++){
      let found = false
      for(let j=0;j< salesChartDt.length;j++){
        if(salesChartDt[j]._id.day == i){
          SalesCount.push({_id:{day:i},count:salesChartDt[j].count})
          found = true
          break;
        }
      }
      if(!found){
        SalesCount.push({_id:{day:i},count:0})
      }
    }
    
    res.render("dashboard",{users,orders,categories,products,SalesCount,salesData});
  } catch (error) {
  
  }
};
const homePage = async (req, res,next) => {
  try {
    res.render("home",{title:"Dashboard"});
  } catch (error) {
    console.log(error.message);
  }
};
const loadUserlist = async (req, res,next) => {
  try {
    const users = await userModel.find();
    // console.log(users);
    res.render("userlist", { users, index: 1 });
  } catch (error) {
    console.log(error.message);
  }
};

const doLogin = async (req, res,next) => {
  console.log("!!!!!!!!");
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    const admin = await adminModel.findOne({ email: email });
    // console.log(admin);
    if (!admin) {
      return res.redirect("/admin");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    // console.log(isMatch);
    if (!isMatch) {
      return res.redirect("/admin");
    }else{
    
    req.session.adminId = admin._id
    req.session.adminLogin = true;
    
    res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};
// Block and Unblock Users
const blockUser = async (req, res,next) => {
  console.log(">>>>>>>>>");
  try {
    const id = req.params.id;
    console.log(id);
    await userModel
      .findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked" } })
      .then(() => {
        res.redirect("/admin/userlist");
      });
  } catch (error) {
    console.log(error.message);
  }
};

const unblockUser = async (req, res,next) => {
  try {
    const id = req.params.id;
    await userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "Unblocked" } }
    ).then(() => {
      res.redirect("/admin/userlist");
    });
  } catch (error) {
    console.log(error.message);
  }
};
const loadAddcategory = async (req, res,next) => {
  try {
    const categories = await categoryModel.find();

    res.render("addcategory", { categories, index: 1 });
  } catch (error) {
    console.log(error.message);
  }
};
const insertCategory = async (req, res,next) => {
  console.log(req.body, ">>>>>>>>>>>>>>>>>>");
  try {
    // const bc=await bcrypt.hash(req.body.password,10)

    const categorydata = new categoryModel({
      name: req.body.name,

      description: req.body.description,
    });
    const categoryData = await categorydata.save();
    if (categoryData) {
      res.redirect("/admin/addcategory");
      // res.send('hello')
    } else {
      res.redirect("/admin/addcategory");
      // res.send('helhiiiiilo')
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadAddproducts =async(req,res,next)=>{
  if (req.session.adminLogin){
    try{
        // const products =await productModel.find()
        // console.log(users);
        const categories = await categoryModel.find()
    res.render('addproducts',{categories})
    }
    catch(error){
      console.log(error.message);
  }
}

}
const loadProductlist = async (req, res,next) => {
  try {
    const products = await productModel.find()
    console.log(products);

    res.render("productlist", {products});
  } catch (error) {
    console.log(error.message);
  }
  
};
// Delete Product
const deleteProduct =  async (req, res,next) => {
  try {
      const id = req.params.id
      await productModel.findByIdAndUpdate({ _id: id }, { $set: { status: false } })
          .then(() => {
              res.redirect('/admin/productlist')
          })

  } catch (err) {
      next(err)
  }
}
const getdeleteProduct =  async (req, res,next) => {
  try {
      const id = req.params.id
      await productModel.findByIdAndUpdate({ _id: id }, { $set: { status: true } })
          .then(() => {
              res.redirect('/admin/productlist')
          })

  } catch (err) {
      next(err)
  }
}

          

 const addProducts = async(req, res,next) => {
  console.log(req.body);
  
  const filenames = req.files.map(file => file.filename);
  console.log(filenames);
  const pro = new productModel({
    productName: req.body.productName,
    mycategory: req.body.mycategory,
    description: req.body.description,
    price:req.body.price,
    image: filenames,
  })
   pro.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" })
    } else {
      req.session.message = {
        type: 'success',
        message: 'Product added successfully'
      }
      res.redirect('/admin/productlist')
    }
  })
}
const loadEditproduct = async (req, res,next) => {
  try {
    const id = req.params.id
    const categories = await categoryModel.find()
    let product = await productModel.findOne({ _id: id })
    console.log(product);
    res.render("editproduct",{categories,product});
  } catch (error) {
    console.log(error.message);
  }
};
// const editProduct= async (req, res) => {
//   try {
//       // if (req.session.adminLogin) {
//           const id = req.params.id
//           const type = await productModel.find()
//           const brand = await categoryModel.find()
//           // const fuel = await FuelModel.find()
//           let product = await ProductModel.findOne({ _id: id }).populate('type', 'typeName').populate('category', 'category').
//           console.log(product)
//           res.render('admin/editProduct', { product, type, brand, fuel, })//admin: req.session.admin 
//       // }

//   } catch (err) {
//       next(err)
//   }

// }
// updateProducts=  (req, res) => {

//   let id = req.params.id
//   let new_images = ''
//   let dataToUpload = {
//     name: req.body.name,
//     category: req.body.category,
//     description: req.body.description,
//     selling_price: req.body.selling_price,
//     listing_price: req.body.listing_price,
//     stock_count: req.body.stock_count,
//   }
//   if (req.files.length>0) {
//     new_images = req.files.map(file => file.filename);
//     dataToUpload.images = new_images
//   }  

//   admin_products.findByIdAndUpdate(id, dataToUpload, (err, result) => {
//     if (err) {
//       res.json({ message: err.message, type: 'danger' })
//     } else {
//       req.session.message = {
//         type: 'success',
//         message: 'Product updated successfully'
//       }
//       res.redirect('/admin/admin_product')
//     }
//   })

// }
// const updateProduct= async (req, res) => {
//   console.log(req.body);
//   try {
//       const { productName, description, mycategory, price} = req.body;
      

//       if (req.file) {
//           // await ProductModel.findByIdAndUpdate(
//           //     { _id: req.params.id }, { $set: { image: image.filename } }
//           // );
//           const image = req.files;
//           image.forEach(img => { });
//           console.log(image);
//           const newimages = image != null ? image.map((img) => img.filename) : null
//           console.log(newimages)

//           await productModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { image: newimages } })
//       }
//       let details = await productModel.findOneAndUpdate(
//           { _id: req.params.id }, { $set: { productName, description, mycategory, price } }
//       );
//       await details.save().then(() => {
//           res.redirect('/admin/productlist')
//       })

//   } catch (err) {
//       // next(err)
//   }
// }
 const updateProduct= (req, res,next) => {

  let id = req.params.id
  let newimages = ''
  let dataToUpload = {
    productName: req.body.productName,
    description: req.body.description,
    mycategory: req.body.mycategory,
    price: req.body.price,

    
  
    
  }
  // console.log(dataToUpload);
  // console.log(req.files);
  if (req.files.length>0) {
    newimages = req.files.map(file => file.filename);
    dataToUpload.image = newimages
  }  
  // console.log(dataToUploads);

  productModel.findByIdAndUpdate(id, dataToUpload, (err, result) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' })
    } else {
      req.session.message = {
        type: 'success',
        message: 'Product updated successfully'
      }
      res.redirect('/admin/productlist')
    }
  })

}
const loadAddcoupon =async(req,res)=>{
  if (req.session.adminLogin){
    try{
       
        
    res.render('addcoupon')
    }
    catch(error){
      console.log(error.message);
  }
}

}
const loadCouponList = async (req, res,next) => {
console.log("ethi");
  try {
    const coupons = await couponModel.find()
    console.log(coupons);

    res.render("couponlist", {coupons});
  } catch (error) {
    console.log(error.message);
  }
  
}
const addCoupon = async(req, res,next) => {
  
  try{
  
  const coupons = new couponModel({
    Name: req.body.name,
    Code: req.body.code,
    Minbill: req.body.bill,
    Cap: req.body.cap,
    Discount: req.body.discount,
    Expire: req.body.date
  })
  await coupons.save()
  .then(() => {
  

  // .catch((error) => {
  //   console.log(error);
    res.redirect("/admin/couponlist");
  // });  
})
} catch (error) {
next(error);
}
};
const editCoupon = async(req,res,next)=>{
 const couponId = req.params.id
const couponDetails = await couponModel.findById({_id:couponId})

  res.render('editcoupon',{couponDetails})
}
const updateCoupon= async(req, res,next) => {
  console.log("LLL");
  try{

  let id = new mongoose.Types.ObjectId(req.params.id)
  
  
  let updatedCoupon ={
  
    Name: req.body.name,
    Code: req.body.code,
    Cap: req.body.cap,
    Discount: req.body.discount,
    Expiry:req.body.expiry,
    Minbill:req.body.bill,
    Date : req.body.date
   
}
await couponModel.updateOne({_id:id},{$set:updatedCoupon}).then(()=>{
  res.redirect('/admin/couponlist')
})
}catch(err){
console.log(err);
}
  }
  const orderList = async (req,res,next)=>{
    try {
      // userId =req.session.userId
      orderdata = await orderModel.find().populate('userId').sort({ ordered_date: -1 })
      console.log(orderdata);

    //  const orderdata = await orderModel.find({userId:userId})
      
  
      res.render("orderlist",orderdata);
    } catch (error) {
      console.log(error.message);
    }
  
  }
  const orderDetails = async (req,res,next)=>{
    console.log("yes");
    try {
      // const coupons = await couponModel.find(
      // console.log(coupons);
     let orderId = req.params.id

      let orderinfo = await orderModel.findById({ _id:orderId}).populate('products.productId')
      let pro =orderinfo.products
      let userD= await orderModel.findById({ _id:orderId}).populate('userId')
      let userData = userD.userId
      


      
      res.render("orderdetails",{pro,userData,orderinfo});
    } catch (error) {
      next(error);
    }
  
  }
  const cancelOrder = async (req,res)=>{
    console.log("camcel orderb get");
   let orderId= req.params.id
    orderModel.updateOne({_id:orderId},{$set:{order_status:'cancelled', 'delivery_status.cancelled.state': true,'delivery_status.cancelled.date': Date.now()}}).then(()=>{
    res.redirect('/admin/orderlist')
   })
  }
  const delivery = async(req,res)=>{
    console.log("innnnnnnnnnnnn");
   let orderId= req.params.id
   console.log(orderId);
    let de= req.body.Delivery
    console.log(de);
 
 
   await orderModel.updateOne({_id:orderId},{$set:{delivery_status:req.body.Delivery}})
    res.redirect('/admin/orderlist')
    

  }
  const invoice= async(req,res,next)=>{
    try {
      let orderId = req.params.id
    let orderInfo = await orderModel.findOne({ _id: orderId }).populate(['products.productId', 'userId'])
    res.render('invoice', {  orderInfo })
    } catch (error) {
      next(error);
    }

  }
  const loadAddBanner = async(req,res,next)=>{
    try{
      res.render('addbannerPage')

    }
    catch(error){
      next(error);
    }
  }
  const addBanner = async(req, res,next) => {
    try {
    
      const filenames = req.files[0].filename
   console.log(filenames);
      const bannerr = new bannerModel({
        name: req.body.bannerName,
        image: filenames,
        description: req.body.description
      })

  // await  bannerr.save().then((data)=>{

    bannerr.save ((error) => {
        if (error) {
          req.session.message = {
            type: 'danger',
            message: 'Error while adding banner' + error.message
          };
          res.redirect('/admin/bannerlist');
        } else {
          req.session.message = {
            type: 'success',
            message: 'Banner added successfully'
          };
          res.redirect('/admin/bannerlist');
        }
      })
    
    } catch (error) {
      next(error)
    }
  }
 
  const logout = async(req,res)=>{
    req.session.destroy((error)=>{
      if (error){
        console.log(error);
      }
      else{
        res.redirect('/admin')
      }
    }
    )
  
  }
  const loadbannerList = async (req, res,next) => {
    console.log("yee");
      try {
        const banners = await bannerModel.find()
        // console.log(coupons);
        console.log(banners);
    
        res.render("bannerlist",{banners});
      } catch (error) {
        next(error);
      }
      
    }
    const updateBanner = async(req, res,next) => {
      console.log("iiii");
      console.log(req.body);
      try{
    
      let id = new mongoose.Types.ObjectId(req.params.id)
      console.log(id);
      const filenames = req.files[0].filename
      console.log(filenames);
      
      
      let updatedbanner ={
      
        name: req.body.name,
        image: filenames,
        description: req.body.description
        
       
    }
    await bannerModel.updateOne({_id:id},{$set:updatedbanner}).then(()=>{
      res.redirect('/admin/bannerlist')
    })
    }catch(error){
    next(error)
    }
      }
      const editBanner = async(req,res,next)=>{
        const bannerId = req.params.id
       const bannerDetails = await bannerModel.findById({_id:bannerId})
       console.log(bannerDetails);
         res.render('editbanner',{bannerDetails})
       }
       const salesData = async (req,res,next)=>{
        console.log("ethiiiiiiiiiiiii");
        console.log(req.body);
        
        try {
           orderdata = await orderModel.aggregate([
            {
              $match: {
                order_status: "pending",
                $and: [
                  { ordered_date: { $gt: new Date(req.body.fromDate) } },
                  { ordered_date: { $lt: new Date(req.body.toDate) } },
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            
            //  {
            //   $project: {
                
            //     user:1
                
            //   }
            // },
            { $sort: { ordered_date: -1 } },
          ]);
          console.log("orderdata",orderdata[0]);
          // new Date
          res.render("salesdata",{orderdata});
        } catch (error) {
          next(error)
        }
       }
       const salesDataExcel = (req,res,next)=>{
        console.log("excellin");
        // console.log(req.body);
        try{
        console.log(orderdata,"excellorderdata");
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Roport");
        worksheet.columns = [
          { header: "s no.", key: "s_no" },
          { header: "Date", key: "data" },
          { header: "User", key: "user" },
          { header: "Payment", key: "payment" },
          { header: "Status", key: "status" },
          { header: "Items", key: "item" },
          { header: "total", key: "total" },
        ];
        let counter = 1;

        orderdata.forEach((sale) => {
          const date = sale.date;
          const isoString = date.toISOString();
          const newDate = isoString.split("T")[0];
          sale.data = newDate;
          sale.s_no = counter;
          sale.user = sale.user[0].name;
          sale.payment = sale.payment.pay_method;
          sale.total = sale.total;
          sale.item = sale.product.length;
          worksheet.addRow(sale);
          counter++;
        });

        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
        });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
        );

        // res.setHeader(
        //   "Content-Disposition",
        //   `attachment; filename=sales_Report_from_${req.body.from}_to_${req.body.toDate}.xlsx`
        // );

        return workbook.xlsx.write(res).then(() => {
          res.status(200);
        });
       
        
        } catch (error) {
          next(error)
        }
      }
      const salesDataExcell = async (req,res)=>{
        const HEADER_ROW = [
          {
            value: 'Name',
            fontWeight: 'bold'
          },
          
        ]
        
        const DATA_ROW_1 = [
          // "Name"
          {
            type: String,
            value: 'John Smith'
          },
        
          
        ]
        const DATA_ROW_2 = [
          // "Name"
          {
            type: String,
            value: 'John soori'
          },
        
          
        ]
        
        const data = [
          HEADER_ROW,
          DATA_ROW_1,
          DATA_ROW_2,
          
        ]
        const objects = [
          {
            name: 'John Smith',
           
          },
          {
            name: 'Alice Brown',
           
          }
        ]
        const schema = [
          {
            column: 'Name',
            type: String,
            value: student => student.name
          },
          
        ]
        try{
        // await writeXlsxFile(objects, { schema,
          
        //   filePath: 'file.xlsx'
        // })
        // const buffer = await writeXlsxFile(data, { buffer: true })
        const output = fs.createWriteStream("filetype.xlsx")
const stream = await writeXlsxFile(data)
stream.pipe(output)

        res.send("success")
      } catch(error){
        console.log(error);
        res.send("error")
      }
      }
       
      

  




  



  
  


  




module.exports = {
  loadLogin,
  doLogin,
  loadDashboard,
  loadUserlist,
  blockUser,
  unblockUser,
  loadAddcategory,
  insertCategory,
  loadAddproducts,
  addProducts,
  homePage,
  loadProductlist,
  deleteProduct,
  getdeleteProduct,
  loadEditproduct,
   updateProduct,
   loadAddcoupon,
   loadCouponList,
   addCoupon,
   editCoupon,
   updateCoupon,
   orderList,
   orderDetails,
   cancelOrder,
   delivery,
   invoice,
   logout,
   addBanner,
   loadAddBanner,
   loadbannerList,
   editBanner,
   updateBanner,
   salesData,
   salesDataExcel,
   salesDataExcell,
}
   

   
  
   
  
  
  
  

