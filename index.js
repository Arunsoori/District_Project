

const express=require("express");
const path=require('path')
const app= express();
const session=require("express-session")
const multer = require('multer')
app.use(express.static(path.join(__dirname, 'public')));
// set view engine
app.set('views', path.join(__dirname, '/views'))  //or
// app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');



// session
const min = 1000 * 60 * 60* 24 ;
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: min },
    
}
))

//CACHE CONTROL
app.use((req, res, next) => {
    console.log('cache success');
    res.set("Cache-Control", "private,no-cache,no-store,must-revalidate");
    next();
})

//for user routes
const user_route = require('./routes/userRoute')

//for admin routes

const admin_route = require('./routes/adminRoute')

app.use('/',user_route)
app.use('/admin', admin_route)

app.listen(3000,function(){
    console.log('server is running...');
})