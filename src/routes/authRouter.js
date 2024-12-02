const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation.js");
const User = require('../models/user.js');
const bcrypt = require("bcrypt");


// sending the data via postman  
authRouter.post('/signup', async (req,res)=>{
    //const user = new User(req.body)
    try{
      validateSignUpData(req);
      const {firstName,lastName,emailId,password,age,gender} = req.body;
      const passwordHash = await bcrypt.hash(password , 10);
      const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
        age,
        gender
      })
      await user.save();
    res.status(200).send("data saved sucess")
    }catch(err){
        res.status(400).send("Something went wrong" + err.message);
    }
    })


    // LOGIN AUTHENTICATION

    authRouter.post('/login',async(req,res)=>{
    try{
     const  {emailId,password} = req.body;  
     const user = await User.findOne({emailId :emailId});
     if(!user){
      throw new Error("Invalid credentials");
     }
     const isPasswordValid = await bcrypt.compare(password,user.password);
     if(isPasswordValid){
    
      // Create a jwt Token here even in API
     // const token = await jwt.sign({_id:user._id},"Usersecretkey",{expiresIn: "1d"});
    
     //Create a token frm Schema
     const token = await user.getJWT();
    
        // res.cookie("token",token,// sent the cookie back to the token 
        //   { expires: new Date(Date.now() + 900000) } // expieir of cookie
        // );  
    
         res.cookie("token",token);  
    
    
      res.send("Login Sucessful");
     }else{
       res.status(400).send("Something went wrong");
     }
    }catch(err){
      console.log(err)
      res.status(400).send("Something went wrong" + err.message);
    }
    })


  //LOGOUT API

    authRouter.post('/logout',async (req,res)=>{
      
        try{
          res.cookie("token",null,{
          expires : new Date(Date.now()),
        }).status(200).send("Logout sucessfully completed");
      }catch(err){
         res.send("Something went wrong" + err);
      }
  
    })


    module.exports = authRouter;


