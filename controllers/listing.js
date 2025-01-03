const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index= async (req,res) =>{
    const alllistings = await listing.find({});
    res.render("listings/index.ejs", {alllistings});


};
module.exports.renderNewForm= (req, res)=>{
   
   
    res.render("listings/new.ejs");
};

module.exports.showListing= async (req,res)=>{
    let {id} = req.params;
    //errr
     const Listing = await listing.findById(id)
     .populate({
        path:"reviews",
        populate:{
            path:"author"
        },})
        .populate("owner"); 
     if(!Listing){
        req.flash("error", " listing you requested does not exists!");
        res.redirect("/listings");
     }
     console.log(Listing);
     res.render("listings/show.ejs", {Listing});
};

module.exports.createListing=async (req, res,next) => {
    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
        
       
        



    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new listing(req.body.listing); 
    newListing.owner= req.user._id;
    newListing.image= {url, filename};
    newListing.geometry= response.body.features[0].geometry;
      
   let savedListing=  await newListing.save();
   console.log(savedListing);
    req.flash("success","New Listing Created!" );
    res.redirect("/listings"); 
  
 };

 module.exports.renderEditForm =async (req,res)=>{
    let {id} = req.params;
    //err
    const listingg = await listingg.findById(id);
    if(!listingg){
        req.flash("error", " listing you requested does not exists!");
        res.redirect("/listings");
     }
     let originalImageUrl= listingg.image.url;
     originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listingg, originalImageUrl});
    };

   module.exports.updateListing=async (req,res)=>{
    let {id} = req.params;
    
    
    let listing= await listing.findByIdAndUpdate(id , {...req.body.listingg});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url, filename};
    await listing.save();
    }
    req.flash("success", " listing updated");
     res.redirect(`/listings/${id}`);
    };

    module.exports.destroyListing= async (req,res)=>{
        let{id}= req.params;
        //err 
        let deletedlisting= await listing.findByIdAndDelete(id);
        console.log(deletedlisting);
        req.flash("success", " listing deleted");
        res.redirect("/listings");
        };