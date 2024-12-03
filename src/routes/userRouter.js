
const express = require("express");
const userRouter = express.Router();
const { userAuth }   = require("../middlewares/auth.js");
const connectionRequestModel = require('../models/connectionRequest.js');
const USER_SAFE_DATA = "firstName lastName age";

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





module.exports = userRouter;



