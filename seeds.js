var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image:"https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A lacus vestibulum sed arcu non odio euismod lacinia at. Ut diam quam nulla porttitor massa id. Senectus et netus et malesuada fames ac turpis egestas integer. Nisl purus in mollis nunc sed id semper risus. Id eu nisl nunc mi ipsum faucibus vitae. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Convallis posuere morbi leo urna molestie at elementum eu facilisis. Amet mauris commodo quis imperdiet massa tincidunt. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Suspendisse ultrices gravida dictum fusce. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus. Ultrices tincidunt arcu non sodales neque sodales ut etiam sit. Cras tincidunt lobortis feugiat vivamus at augue."
    },
    {
        name: "Desert Mesa", 
        image:"https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A lacus vestibulum sed arcu non odio euismod lacinia at. Ut diam quam nulla porttitor massa id. Senectus et netus et malesuada fames ac turpis egestas integer. Nisl purus in mollis nunc sed id semper risus. Id eu nisl nunc mi ipsum faucibus vitae. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Convallis posuere morbi leo urna molestie at elementum eu facilisis. Amet mauris commodo quis imperdiet massa tincidunt. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Suspendisse ultrices gravida dictum fusce. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus. Ultrices tincidunt arcu non sodales neque sodales ut etiam sit. Cras tincidunt lobortis feugiat vivamus at augue."
    },
    {
        name: "Canyon Floor", 
        image:"https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A lacus vestibulum sed arcu non odio euismod lacinia at. Ut diam quam nulla porttitor massa id. Senectus et netus et malesuada fames ac turpis egestas integer. Nisl purus in mollis nunc sed id semper risus. Id eu nisl nunc mi ipsum faucibus vitae. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Convallis posuere morbi leo urna molestie at elementum eu facilisis. Amet mauris commodo quis imperdiet massa tincidunt. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Suspendisse ultrices gravida dictum fusce. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus. Ultrices tincidunt arcu non sodales neque sodales ut etiam sit. Cras tincidunt lobortis feugiat vivamus at augue."
    }
]

function seedDB(){
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is greate, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                            
                        });
                }
            }); 
        });        
    });

    //add a few comments
}
module.exports = seedDB;
