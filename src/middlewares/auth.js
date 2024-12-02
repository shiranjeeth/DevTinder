const jwt = require("jsonwebtoken");
const User = require('../models/user.js'); 


const userAuth = async (req,res,next) =>{
try{
    const {token } = req.cookies;
    if(!token){
        throw new Error("Token is not valid");
    }
    const decodedObj = await jwt.verify(token,"Usersecretkey");
    const {_id} = decodedObj;
    const user  = await User.findById(_id);
    if(!user){
        throw new Error("User not found")
    }
    req.user = user;   /// this auth is checking the username and password and send back the user
    next()
}catch(err){
    res.status(400).send("Error : " + err.message);
}

}

module.exports = {
    userAuth
}

