var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
const { route } = require("./comments");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function (req, res) {
  //fuzzy search
  var noMatch = null;
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({name: regex}, function (err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        if(allCampgrounds.length<1){
          noMatch="No campgrounds match that query, please try again";
        } 
        res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch:noMatch, page: "campgrounds"});
      }
    });    
  } else {
  // get all campgrounds from db and render
    Campground.find({}, function (err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch:noMatch, page: "campgrounds"});
      }
    });
  }
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    createdAt: { type: Date, default: Date.now },
    author: author,
  };
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
  // find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments likes")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        // render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});
// Campgrond Like Route
router.post('/:id/like', middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
      return res.redirect("/campgrounds");
    }
    //check if req.user._id exists in foundCampground.likes
    var foundUserLike = foundCampground.likes.some(function(like){
      return like.equals(req.user._id);
    });
    if(foundUserLike){
      //user already liked, removing like
      foundCampground.likes.pull(req.user._id);
    } else {
      foundCampground.likes.push(req.user);
    }
    foundCampground.save(function(err){
      if(err){
        console.log(err);
        return res.redirect("/campgrounds");
      }
      return res.redirect("/campgrounds/" + foundCampground._id);
    });
  });
});
// Edit Campground route
// router.get("/:id/edit", function(req, res){
//     // is user logged in
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err){
//                 res.redirect("/campgrounds")
//             } else{
//                 // does user own the campground?
//                 if(foundCampground.author.id.equals(req.user._id)){
//                     res.render("campgrounds/edit", {campground: foundCampground});
//                 } else {
//                     res.send("YOU DO NOT HAVE PERMISSION TO DO THAT!");
//                 }
//             }
//         });
//     } else{
//         console.log("YOU NEED TO BE LOGGED IN TO DO THAT!!");
//         res.send("YOU NEED TO BE LOGGED IN TO DO THAT!!")
//     }

//         //otherwise, redirect
//     // if not, redirect
// });
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req,res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// Update Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
