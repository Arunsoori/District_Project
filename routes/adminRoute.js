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
admin_route.get("/dashboard",Session.adminSession, adminController.loadDashboard);
admin_route.get("/userlist",Session.adminSession, adminController.loadUserlist);
admin_route.get("/addcategory",Session.adminSession, adminController.loadAddcategory);
admin_route.get("/editcategory/:id",Session.adminSession, adminController.loadeditCategory);
admin_route.get("/deletecategory/:id", Session.adminSession,adminController.deleteCategory);


admin_route.get("/addproducts",Session.adminSession, adminController.loadAddproducts);
admin_route.get("/home",Session.adminSession, adminController.homePage);
admin_route.get("/productlist",Session.adminSession, adminController.loadProductlist);
admin_route.get("/editproduct/:id", Session.adminSession,adminController.loadEditproduct);
admin_route.get("/addcoupon",Session.adminSession, adminController.loadAddcoupon);
admin_route.get("/couponlist", Session.adminSession,adminController.loadCouponList);
admin_route.get("/editcoupon/:id", Session.adminSession,adminController.editCoupon);
admin_route.get("/deletecoupon/:id",Session.adminSession, adminController.deleteCoupon);



admin_route.get("/orderlist", Session.adminSession,adminController.orderList);
admin_route.get("/orderdetails/:id",Session.adminSession, adminController.orderDetails);
admin_route.get("/cancelorder/:id", Session.adminSession,adminController.cancelOrder);
admin_route.get("/invoice/:id",Session.adminSession, adminController.invoice);
admin_route.get("/logout",Session.adminSession, adminController.logout);
admin_route.post("/addbanner",uploadOptions.array("image", 1), adminController.addBanner);
admin_route.get("/addbannerPage",Session.adminSession, adminController.loadAddBanner);
admin_route.get("/bannerlist",Session.adminSession, adminController.loadbannerList);
admin_route.get("/editbanner/:id",Session.adminSession, adminController.editBanner);
admin_route.post("/salesdata",Session.adminSession, adminController.salesData);
admin_route.get("/salesdataexcel",Session.adminSession, adminController.salesDataExcel);
// admin_route.get("/salesdataexcell", adminController.salesDataExcell);























//post
admin_route.post("/", adminController.doLogin);
admin_route.post("/blockUser/:id", adminController.blockUser);
admin_route.post("/unblockUser/:id", adminController.unblockUser);
admin_route.post("/addcategory", adminController.insertCategory);
admin_route.post("/deleteProduct/:id", adminController.deleteProduct);
admin_route.post("/getdeleteProduct/:id", adminController.getdeleteProduct);
admin_route.post("/updateProduct/:id",uploadOptions.array("image", 5), adminController.updateProduct);
admin_route.post("/updatecategory/:id", adminController.updateCategory);








// admin_route.post('/addproducts',adminController.addProducts)
admin_route.post( "/addproducts", uploadOptions.array("image", 4), adminController.addProducts);
admin_route.post("/addcoupon", adminController.addCoupon);
admin_route.post("/updatecoupon/:id",adminController.updateCoupon);
admin_route.post("/delivery/:id",adminController.delivery);
admin_route.post("/updateBanner/:id",uploadOptions.array("image", 1),
adminController.updateBanner);





module.exports = admin_route;
