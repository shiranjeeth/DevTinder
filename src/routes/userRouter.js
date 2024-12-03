
const express = require("express");
const userRouter = express.Router();
const { userAuth }   = require("../middlewares/auth.js");
const connectionRequestModel = require('../models/connectionRequest.js');


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


module.exports = userRouter;



