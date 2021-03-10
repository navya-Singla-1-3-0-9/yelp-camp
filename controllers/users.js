const User= require('../models/user.js');
const Review= require('../models/review.js');

module.exports.registerForm= (req,res)=>{
	res.render('user/register')
}
module.exports.regUser = async (req,res)=>{
	const {email, username, password}= req.body;
	const nu = new User({email, username});
	const regdUser= await User.register(nu, password);
	req.flash('success','Successfully registered')
	res.redirect('/campgrounds')
}

module.exports.loginForm = (req,res)=>{
	res.render('user/login')
}
module.exports.loginUser = (req,res)=>{
	if(req.session.returnTo){
		res.redirect(req.session.returnTo);
		delete req.session.returnTo;
	}else{
	req.flash('success', 'Successfully logged in');
	res.redirect('/campgrounds');
}
}

module.exports.logoutUser= (req,res)=>{
	req.logout();
	req.flash('success', 'logged out')
	res.redirect('/campgrounds');
}