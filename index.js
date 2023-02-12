

const express=require("express");
const path=require('path')
const app= express();
const session=require("express-session")
const multer = require('multer')
const logger = require('morgan')
app.use(express.static(path.join(__dirname, 'public')));
// set view engine
app.set('views', path.join(__dirname, '/views'))  //or
// app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

//morgan
app.use(logger('dev'))

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
app.use('/admin', admin_route)

app.use('/',user_route)
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

app.listen(3000,function(){
    console.log('server is running...');
})