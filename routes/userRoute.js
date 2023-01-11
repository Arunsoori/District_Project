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
user_route.get('/shop',userController.shop)
user_route.get("/singleprodetails",userController.singleProdetails);




user_route.get('/register',userController.loadRegister)
user_route.post('/register',userController.insertUser)

module.exports =user_route