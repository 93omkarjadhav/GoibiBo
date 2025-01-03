const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsnyc= require("../utlis/wrapasync.js");
const expressError= require("../utlis/expresserror.js");

const review=require("../models/review.js");
const listing = require("../models/listing.js");
const{validateReview}= require("../middleware.js")
const reviewController= require("../controllers/reviews.js")

router.post("/",validateReview, wrapAsnyc(reviewController.createReview));
  
  
  //delete reiew route
 router.delete("/:reviewId", wrapAsnyc(reviewController.destroyReview));

  module.exports= router;