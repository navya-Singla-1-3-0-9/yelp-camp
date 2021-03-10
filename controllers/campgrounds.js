const Campground= require('../models/campground.js');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index= async (req,res)=>{
	const campgrounds= await Campground.find({});
	res.render("campgrounds/index", { campgrounds});
}


module.exports.newForm= async(req,res)=>{

	res.render('campgrounds/new');
}


module.exports.delete= async(req,res)=>{
	const {id}= req.params;
	const cg = await Campground.findById(id);
	if(!cg.author.equals(req.user.id)){
		req.flash('error', 'Permission denied');
		res.redirect(`/campgrounds/${id}`)
	}else{
	await Campground.findByIdAndDelete(id);
	req.flash('success',"Successfully Deleted Campground");
	res.redirect('/campgrounds');
}
}


module.exports.editForm= async (req,res)=>{
	const { id }= req.params;
	const cg= await Campground.findById(id);
	if(!cg.author.equals(req.user.id)){
		req.flash('error', 'Permission denied');
		res.redirect(`/campgrounds/${id}`)
	}else{
	res.render("campgrounds/edit", {cg} );
}
}


module.exports.showPage= async (req,res)=>{
	const { id }= req.params;
	const cg= await Campground.findById(id).populate({
		path:"reviews",
		populate:{
			path:"author"
		}
	}).populate('author');
	res.render("campgrounds/show", {cg} );
}

module.exports.updatecg= async (req,res)=>{
	const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteimages){
    	for(let f of req.body.deleteimages){
    		cloudinary.uploader.destroy(f);
    	}
   await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteimages}}}});
}
    console.log(req.body);
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.create = async (req,res)=>{
	const geodata = await geocoder.forwardGeocode({
		query:req.body.location,
		limit:1
	}).send()
	
 	const ncg = new Campground(req.body);
 	ncg.geometry= geodata.body.features[0].geometry;
 	ncg.images = req.files.map(f=>({url: f.path, filename: f.filename}));
 	ncg.author= req.user.id;
 	ncg.save();
 	console.log(ncg);
 	req.flash('success','Successfully made a new campground')
 	res.redirect('/campgrounds');
 }