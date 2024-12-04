
const express = require("express");
const userRouter = express.Router();
const { userAuth }   = require("../middlewares/auth.js");
const connectionRequestModel = require('../models/connectionRequest.js');
const { set } = require("mongoose");
const USER_SAFE_DATA = "firstName lastName age";
const User = require("../models/user.js");

userRouter.get("/user/requests/received" , userAuth, async (req,res)=>{

    try{
        const loggedInUser = req.user;
        const receivedConnectionRequest = await connectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",["firstName","lastName","age"] ) // populate code here allows to get data from the fromUserId from the User model

        res.json({
            message : "response fetched sucessfully",
            data : receivedConnectionRequest
        })
    }catch(err){
        res.status(400).send("ERROR :"+err)
    }
   
})
//get the users connection
userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const checkConnectionsList = await connectionRequestModel.find({
            $or:[
                {toUserId :loggedInUser._id ,status : "accepted" },
                {fromUserId :loggedInUser._id , status : "accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA); 


        //data should be the users except the logged in user
        const filteredConnections = checkConnectionsList.map(connection => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId;
            }else{
                return connection.fromUserId;
            }
        });

        res.status(200).json({
            data : filteredConnections
        })
    }catch(err){
        res.status(400).send("Error : "+err);
    }
})

// get the home page API aka Feed API of the Devtinder
userRouter.get("/user/feed",userAuth, async (req,res)=>{
try{
    const loggedInUser = req.user;

    // pagination 
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // this 50 is the maximum limit of api to be shown for a page 
    limit = limit > 50 ? 50 : limit;

    const skip = (page -1) * limit;


    const filteredConnections = await connectionRequestModel.find({
        $or : [
            {fromUserId : loggedInUser._id },{toUserId : loggedInUser._id}
        ]
    }).select("fromUserId , toUserId");
    const hideFromFeed = new Set()  // set datastructure will not allow duplicated  entry so only

    filteredConnections.forEach((req) =>{
        hideFromFeed.add(req.fromUserId.toString());
        hideFromFeed.add(req.toUserId.toString());
    })

    console.log(hideFromFeed);
// we are using and $nin aka "not in" $ne aka "not equal to"  validate the users to show in the feed 
    const users = await User.find({  
         $and : [
            { _id: { $nin : Array.from(hideFromFeed)}},
            {_id: { $ne :  loggedInUser._id}}
         ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit); // skip and limit is used for pagination

    res.status(200).json({
        data : users
    })
}catch(err){
res.status(400).send(err)
}
})



module.exports = userRouter;



