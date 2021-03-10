const express= require('express');
const router= express.Router();
const path = require('path');
const Campground= require('../models/campground.js');
const Review= require('../models/review.js');
router.use(express.urlencoded({extended:true}));
const campgrounds= require('../controllers/campgrounds');
const reviews= require('../controllers/reviews');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload= multer({ storage});


const isLoggedIn= async (req,res,next)=>{
	if(!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl;
		req.flash('error','You must be logged in');
		
		return res.redirect('/login');

	}
	
	next();
}

const isReviewAuthor = async (req, res, next) => {
    const { id, revid } = req.params;
    const review = await Review.findById(revid);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
 
router.route('/campgrounds').get(campgrounds.index)
.post(isLoggedIn, upload.array('image'),campgrounds.create);
router.get('/campgrounds/new', isLoggedIn,campgrounds.newForm);
router.get('/campgrounds/:id/delete',isLoggedIn,campgrounds.delete);
router.get('/campgrounds/:id/edit',isLoggedIn,campgrounds.editForm);
router.route('/campgrounds/:id').get(campgrounds.showPage)
.post(isLoggedIn,upload.array('image'),campgrounds.updatecg);



router.post('/campgrounds/:id/reviews',isLoggedIn,reviews.createReview);
router.post('/campgrounds/:id/reviews/:revid',isLoggedIn,isReviewAuthor,reviews.updateRev);
 
 module.exports=router;