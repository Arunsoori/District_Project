const express = require("express");
const admin_route = express();
const file = require('../utils/multer')
const multer = require("multer");
const isLogin = require('../middleware/auth')


admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

const path = require("path");



const uploadOptions = multer({ storage: file.storage });

const adminController = require("../controllers/adminController");
const Session = require('../middleware/auth')


//get

admin_route.get("/", adminController.loadLogin);
admin_route.get("/dashboard", adminController.loadDashboard);
admin_route.get("/userlist", adminController.loadUserlist);
admin_route.get("/addcategory", adminController.loadAddcategory);
admin_route.get("/addproducts", adminController.loadAddproducts);
admin_route.get("/home", adminController.homePage);
admin_route.get("/productlist", adminController.loadProductlist);
admin_route.get("/editproduct/:id", adminController.loadEditproduct);
admin_route.get("/addcoupon", adminController.loadAddcoupon);
admin_route.get("/couponlist", adminController.loadCouponList);
admin_route.get("/editcoupon/:id", adminController.editCoupon);
admin_route.get("/orderlist", adminController.orderList);
admin_route.get("/orderdetails/:id", adminController.orderDetails);
admin_route.get("/cancelorder/:id", adminController.cancelOrder);
admin_route.get("/invoice/:id", adminController.invoice);
admin_route.get("/logout", adminController.logout);
admin_route.post("/addbanner",uploadOptions.array("image", 1), adminController.addBanner);
admin_route.get("/addbannerPage", adminController.loadAddBanner);
admin_route.get("/bannerlist", adminController.loadbannerList);
admin_route.get("/editbanner/:id", adminController.editBanner);
admin_route.post("/salesdata", adminController.salesData);
admin_route.get("/salesdataexcel", adminController.salesDataExcel);
admin_route.get("/salesdataexcell", adminController.salesDataExcell);























//post
admin_route.post("/", adminController.doLogin);
admin_route.post("/blockUser/:id", adminController.blockUser);
admin_route.post("/unblockUser/:id", adminController.unblockUser);
admin_route.post("/addcategory", adminController.insertCategory);
admin_route.post("/deleteProduct/:id", adminController.deleteProduct);
admin_route.post("/getdeleteProduct/:id", adminController.getdeleteProduct);
admin_route.post("/updateProduct/:id",uploadOptions.array("image", 5), adminController.updateProduct);







// admin_route.post('/addproducts',adminController.addProducts)
admin_route.post( "/addproducts", uploadOptions.array("image", 4), adminController.addProducts);
admin_route.post("/addcoupon", adminController.addCoupon);
admin_route.post("/updatecoupon/:id",adminController.updateCoupon);
admin_route.post("/delivery/:id",adminController.delivery);
admin_route.post("/updateBanner/:id",uploadOptions.array("image", 1),
adminController.updateBanner);





module.exports = admin_route;
