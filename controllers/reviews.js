const Listing= require("../models/listing");
const Review= require("../models/review")

module.exports.createReview= async (req,res)=>{

    let Listingg= await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
  
    Listingg.reviews.push(newreview);
  
   await newreview.save();
   await Listingg.save();
   req.flash("success", " new review created");
  
  //   console.log("new review saved");
  //   res.send("new review saved");
  
   res.redirect(`/listings/${Listingg._id}`);
  };

  module.exports.destroyReview=async( req, res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull :{ reviews: reviewId}});
    await reviewId.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted");

    res.redirect(`/listings/${id}`);
}