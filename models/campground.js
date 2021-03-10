const mongoose = require('mongoose');
const Review= require('./review.js')
const schema= mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new schema({
	title: String,
	images:[{
	   url:String,
	   filename: String
	}
	],
	 geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
	price: Number,
	description: String,
	location: String,
	author:{
		type: schema.Types.ObjectId,
		ref:'User'

	},
	reviews: [
	{
		type: schema.Types.ObjectId,
		ref:'Review'
	}
	]
},opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});
campgroundSchema.post('findOneAndDelete',async function(doc){
	if(doc){
		await Review.remove({
			_id:{
				$in: doc.reviews
			}
		})
	}
})

module.exports= mongoose.model('Campground',campgroundSchema);