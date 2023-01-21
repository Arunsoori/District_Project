const express = require('express')
const user_route =express();

user_route.set('view engine','ejs')
user_route.set('views','./views/users')



const bodyParser = require('body-parser');
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}))




const multer =require("multer");
const path = require("path")
const storage = multer.diskStorage({
    destination:function(req,file,cb){
cb(null,path.join(__dirname,'/public/images'))
    },
    filename:function(){
        const name =Date.now()+'_'+file.originalname;
        cb(null,name);
    
    }
})
const upload = multer({storage:storage})

const userSession = require('../middleware/auth')

const userController = require("../controllers/userController")
user_route.get('/',userController.home)
user_route.get('/login',userController.loadLogin)
user_route.post('/login',userController.doLogin)
user_route.get('/shop',userController.countItem,userController.shop)
user_route.get("/singleprodetails/:id",userController.countItem,userController.singleProdetails);
user_route.get('/register',userController.loadRegister)
user_route.get('/verify',userController.verifyOtpPage);


// user_route.post('/register',userController.insertUser,userController.getOtp)
user_route.get('/resendotp',userController.getOtp);
user_route.get('/addtocart/:id',userController.addToCart);
user_route.get('/wishlist',userController.countItem,userController.loadWishlist)

user_route.get('/addToWishlist/:id',userController.addToWishlist);

user_route.get('/cart',userController.countItem,userController.loadCart);
user_route.get('/removeCart/:id',userController.removeCart);
user_route.get('/removeWish/:id',userController.countItem,userController.removeWish);
user_route.get('/checkout',userController.checkout);

user_route.post('/changeItemQty/',userController.changeItemQty);


// user_route.get('/cart404',userController.cart404);





user_route.post('/verify',userController.verifyUser);
user_route.post('/register',userController.insertUser,userController.getOtp)








module.exports =user_route