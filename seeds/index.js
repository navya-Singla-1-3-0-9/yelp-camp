const mongoose = require('mongoose');
const cities= require('./cities');
const {places, descriptors} = require('./seedHelpers');

const db_url= process.env.DB_URL;
mongoose.connect(,db_url, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("CONNECTED!");
});
const Campground= require('../models/campground.js');
const Review= require('../models/review.js');

const sample= (arr)=>{
	return arr[Math.floor(Math.random()*arr.length)];
}
const seedDB= async()=>{
	await Campground.deleteMany({});
	await Review.deleteMany({});
	for(let i=0;i<20;i++){
		const random1000= Math.floor(Math.random()*1000);
		const p= Math.floor(Math.random()*30);
		const camp = new Campground({
			location:`${cities[random1000].city}, ${cities[random1000].state}`,
			title:`${sample(descriptors)} ${sample(places)}`,
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			price: p,
			author:'6045e8161d89c20ad42286dd',
			images: [
    {
      url: 'https://res.cloudinary.com/dbtbkjcs8/image/upload/v1615270228/yelpCamp/ijrjpitoqhnxuijlaefj.jpg',
      filename: 'yelpCamp/ijrjpitoqhnxuijlaefj'
    },
    {
      url: 'https://res.cloudinary.com/dbtbkjcs8/image/upload/v1615270229/yelpCamp/umbih8hu8q18u5eufbgj.jpg',
      filename: 'yelpCamp/umbih8hu8q18u5eufbgj'
    },
    {
      url: 'https://res.cloudinary.com/dbtbkjcs8/image/upload/v1615270228/yelpCamp/ce2kffqax8sw1s5yszab.jpg',
      filename: 'yelpCamp/ce2kffqax8sw1s5yszab'
    }
  ],
   geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }
		})
		await camp.save();
	}
	
}
seedDB().then(()=>{
	mongoose.connection.close();
});