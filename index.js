if(process.env.NODE_ENV!=="production"){
	require('dotenv').config();
}
//D5X723rdXGhsGNcd
//mongodb+srv://navya1309:<password>@cluster0.r4yme.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const express= require('express');
const session = require('express-session')
const app= express();
const flash = require('connect-flash');
const passport= require('passport');
const localStrategy= require('passport-local'); 
app.set("view engine","ejs");
const path = require('path');
app.use(express.static("public"));
const mongoose = require('mongoose');
const db_url= process.env.DB_URL;
mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("CONNECTED!");
});
const sessionConfig={
	secret: 'Thisisasecret',
	resave: false,
	saveUninitialized: true,
	cookie:{
		httpOnly: true,
		expires: Date.now()+1000*60*60*24*7,
		maxAge: 1000*60*60*24*7
	}
}
const User = require('./models/user.js');
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//handling login
passport.serializeUser(User.serializeUser());
//handling logout
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
	console.log(req.session);
	res.locals.currUser= req.user;
	res.locals.success=  req.flash('success');
	res.locals.error= req.flash('error');
	next();
})
const Campground= require('./models/campground.js');
const Review= require('./models/review.js');
const campgrounds= require('./routes/campgrounds.js');
const UserRoutes= require('./routes/users.js')
app.use('/', campgrounds);
app.use('/', UserRoutes);


app.use(express.urlencoded({extended:true}));
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
	res.render("home");
})
const port = process.env.PORT||8080;
app.listen(port,()=>{
	console.log("server up!");
})