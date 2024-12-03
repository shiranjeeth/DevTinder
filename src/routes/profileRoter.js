const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth.js');
const {validateEditProfilePassword} = require('../utils/validation.js');
const {validateEditProfile} = require('../utils/validation.js');
const bcrypt = require("bcrypt");


// Code before Auth middle ware 

// profileRouter.get('/profile', async (req,res)=>{
//   try{
//     var cookies = req.cookies;
//     const {token} = cookies;
//     //handling error
//     if(!token){
//       throw new Error("invalid credentials")
//     }
//     const decodedMessage = await jwt.verify(token, "Usersecretkey");
//     const {_id } = decodedMessage;
//     //getting the user id from the token
//     const user = await User.findById(_id);
//     console.log("Logged in user" +" "+ _id);
//     console.log( "The cookie is " + cookies);
//     //handling the error
//     if(!user){
//       throw new Error("User not found log in again")
//     }
//     res.send(user);
//   }catch(err){
//     res.status(400).send(err.message);
//   }

// })

// After using the Auth middleware
profileRouter.get('/profile/view', userAuth, async (req,res)=>{
    try{
      const user = req.user;
      if(!user){
        throw new Error("User not found log in again")
      }
      res.send(user);
    }catch(err){
      res.status(400).send(err.message);
    }
  
  })

  profileRouter.patch('/profile/edit',userAuth, async (req,res)=>{
     try{
      if(!validateEditProfile(req)){
        throw new Error("Invalid Edit request");
      };
      const loggedInUser = req.user;  //  got the value from the userAuth 
     // console.log(loggedInUser);

      Object.keys(req.body).forEach((key)=>{
        loggedInUser[key] = req.body[key]
    }); // here i am setting up the new values for the user from postman
   // console.log(loggedInUser);
    await loggedInUser.save();   // the functionality to save in database
      res.json({
        message : `${loggedInUser.firstName} , Your profile is update sucessfully`,
        data : loggedInUser,
      })
     }catch(err){
        res.send(" ERROR :"+" "+err);
     }
  })


  //Forget password Api 

  profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
    try {
        // Step 1: Validate the request body to check if newPassword and confirmPassword are provided
        const { newPassword, confirmPassword } = req.body;

        // Check if the new password and confirm password are provided
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Please provide both new password and confirmation." });
        }

        // Optional: Validate password strength (you can add more checks like length, symbols, etc.)
        if (!validateEditProfilePassword(newPassword)) {
            return res.status(400).json({ message: "Password does not meet the required strength." });
        }

        // Step 2: Check if the passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Step 3: Find the logged-in user (assuming req.user is set by the authentication middleware)
        const loggedInUser = req.user;

        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Step 4: Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Step 5: Update the user's password in the database
        loggedInUser.password = hashedPassword;
        await loggedInUser.save(); // Save the updated user document

        // Step 6: Respond with a success message
        res.json({
            message: `${loggedInUser.firstName}, your password has been changed successfully.`,
            data: { userId: loggedInUser._id, firstName: loggedInUser.firstName },
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("ERROR: " + err.message);
    }
});


  module.exports = profileRouter;
  