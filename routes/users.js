const express= require('express');
const router= express.Router();
const path = require('path');
const User= require('../models/user.js');
const Review= require('../models/review.js');
router.use(express.urlencoded({extended:true}));
const passport= require('passport');
const users= require('../controllers/users.js');


router.route('/register')
.get(users.registerForm)
.post(users.regUser);
router.route('/login').get(users.loginForm)
.post(passport.authenticate('local',{failureFlash:'Invalid username or password', failureRedirect:'/login'}),users.loginUser);
router.get('/logout',users.logoutUser);
module.exports=router;