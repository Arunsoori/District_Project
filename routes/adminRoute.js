const express = require("express");
const admin_route = express();
const file = require('../utils/multer')
const multer = require("multer");


admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admin");

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

const path = require("path");



const uploadOptions = multer({ storage: file.storage });
const adminController = require("../controllers/adminController");

//get

admin_route.get("/", adminController.loadLogin);
admin_route.get("/dashboard", adminController.loadDashboard);
admin_route.get("/userlist", adminController.loadUserlist);
admin_route.get("/addcategory", adminController.loadAddcategory);
admin_route.get("/addproducts", adminController.loadAddproducts);
admin_route.get("/home", adminController.homePage);
admin_route.get("/productlist", adminController.loadProductlist);
admin_route.get("/editproduct/:id", adminController.loadEditproduct);




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

module.exports = admin_route;
