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

const Session = require('../middleware/auth')

const userController = require("../controllers/userController")
user_route.get('/',userController.countItem,userController.home)
user_route.get('/login',userController.loadLogin)
user_route.get('/shop',Session.userSession,userController.countItem,userController.shop)
user_route.get("/singleprodetails/:id",Session.userSession,userController.countItem,userController.singleProdetails);
user_route.get('/register',userController.loadRegister)
user_route.get('/verify',userController.verifyOtpPage);
user_route.get('/logout',userController.logout);



// user_route.post('/register',userController.insertUser,userController.getOtp)
user_route.get('/resendotp',userController.getOtp);
user_route.get('/addtocart/:id',Session.userSession,userController.countItem,userController.addToCart);
user_route.get('/wishlist',userController.countItem,userController.loadWishlist)

user_route.get('/addToWishlist/:id',userController.addToWishlist);

user_route.get('/cart',userController.countItem,userController.loadCart);
user_route.get('/removeCart/:id',userController.removeCart);
user_route.get('/removeWish/:id',userController.countItem,userController.removeWish);
user_route.get('/checkout',userController.checkout);
user_route.get('/account',Session.userSession,userController.countItem,userController.account);
user_route.get('/forgotpassword',userController.forgotpasswordPage);
user_route.get('/resetpassword',userController.resetPasswordPage)
user_route.get('/useorderdetails/:id',Session.userSession,userController.countItem,userController.useorderDetails)
user_route.get('/ordersuccess',userController.orderSuccess)







user_route.post('/login',userController.doLogin)

user_route.post('/changeItemQty/',userController.changeItemQty);


// user_route.get('/cart404',userController.cart404);





user_route.post('/verify',userController.verifyUser);
user_route.post('/register',userController.insertUser,userController.getOtp)
user_route.post('/address',userController.addAddress)

user_route.get('/editaddress/:id',userController.editAddressPage)

user_route.post('/updateaddress/:id',userController.updateAddress)

user_route.get('/deleteaddress/:id',userController.deleteAddress )
user_route.post('/applycoupon',userController.applyCoupon )

user_route.post('/placeorder',Session.userSession,userController.placeOrder)
user_route.post('/forgotpassword',userController.forgotPassword)
user_route.post('/resetpassword',userController.resetPassword)
user_route.post('/verifypayment',userController.verifyPayment)
user_route.post('/updateprofile',userController.updateProfile)

















module.exports =user_route