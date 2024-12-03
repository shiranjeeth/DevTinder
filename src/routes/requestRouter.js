const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const connectionRequestModel = require('../models/connectionRequest.js');
const User = require("../models/user.js");
const { Connection } = require("mongoose");
const mongoose = require("mongoose");



requestRouter.post("/request/send/:status/:touserId",userAuth, async (req,res)=>{
   try{
    const fromUserId = req.user._id;
    const toUserId = req.params.touserId;
    const status = req.params.status;  // have to validate the status only ignored ,interested should be present
    

    // this code is to validate the status
   const allowedStatus = ["ignored","interested"];
   if(!allowedStatus.includes(status)){
     return res.status(400).json({
      message : "Invalid status type" + " "+status
     })
      
   }

   //This code is to validate the valid touserId from Database
  const toUser= await User.findById(toUserId)
  if(!toUser){
   return res.status(400).json({
      message : "User not found"
   })
  }

  // how can shiran send connection request to him even 
  //to avoid that the below validation is written
  // this validation is handled by akshay in the schema level check the scjhema level also;
  
  // const signupUser = await User.findById(toUserId)
  // console.log(signupUser);
  // if (signupUser._id.toString() === fromUserId.toString()) {
  //  return res.status(400).json({
  //     message: "You cannot send a request to yourself"
  //  });
  // }

    const newConnectionRequest = new connectionRequestModel({
      fromUserId,
      toUserId,
      status
    })


    const existingConnectionRequest  = await connectionRequestModel.findOne({
      // the below code is the mongo db query;
      // this query works basically like once shiran gave request to starry starry should not give request to shiran
      // this validation is for not allowing duplicate values in the DataBase
      $or : [
         {fromUserId,toUserId},
         {fromUserId:toUserId,toUserId:fromUserId},
      ]
    })

    if(existingConnectionRequest){
      return res.status(400).json({
         message : "Connection request already exist"
      })
    }

    const data = await newConnectionRequest.save();
    res.json({
      message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
      data,
    })
}catch(err){
     res.status(400).send( "ERROR" + err );
   }

})

// think like the users invite recived from others
// here in the below code we are checking the reqId is from Db to the userId is our logged in ID
requestRouter.post("/request/review/:status/:requestID",userAuth, async (req,res)=>{


  try{
    const loggedInUser = req.user._id;
    const {status ,requestID } = req.params;
  
  //validation of status
  const allowedStatus = ["accepted","rejected"];
  if(!allowedStatus.includes(status)){
    throw new Error("The status is invalid");
  }
  const requestIDObj = new mongoose.Types.ObjectId(requestID);
//  console.log("ReqID"+requestID);
 // console.log("loggedInUser"+loggedInUser)

 // validation 
  const connectionRequest  = await connectionRequestModel.findOne({
    _id : requestIDObj,
    toUserId : loggedInUser,
    status: { $regex: /^interested$/i }
  })
  
  if(!connectionRequest){
    return res.status(404).json({
      message : "Connection request not found !"
    })
  }
  connectionRequest.status = status;
  const data = await connectionRequest.save();

res.status(400).json({
  message : "Connection request" + status , data 
})
  }catch(err){
    res.status(400).send("ERROR : "+err);
  }

})

module.exports = requestRouter;
