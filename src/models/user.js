const mongoose = require("mongoose");
const validator  = require("validator");
const jwt = require("jsonwebtoken");

// const customEmailValidation =(value)=>{
//     const regex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return regex.test(value)
// }

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "FirstName is required"],
        set: (value) => validator.escape(value),
        index : true,  // to index a paticular thing so that we can query fast
    },
    lastName : {
        type : String,
        set: (value) => validator.escape(value),
    },
    emailId : {
        type:String,
        required :[true,"The Email is required"],
        unique :true, // another way of indexing 
        
        // validate: {
        //     validator : customEmailValidation,
        //     message : "Please enter the correct email address"
        // },
        validate(value){
           if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address kindly check it" + " " + value);
           }
        },
        unique : true,
    },
    password : {
        type : String,
        required : [true , "Password is required"],
        minlength : [ 8,"password must be atleast 8 char" ]
    },
    age : {
        type : Number,
        min : [18,"Age must be greater than 18"],
        max : [100 ,"Age must be less than 100"],   
    },
    gender : {
        type : String,
        enum : {
            values : ['male',"female","others"],
            message : '{value} is not a valid gender.Allowed values are : Male , female and others ',
        },
        required : [true,"gender is required"],
    },
},
{
    timestamps : true
}
)
// create jwt token in schema
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id },"Usersecretkey",{
        expiresIn : "7d",
    });
     return token;
}   


module.exports = mongoose.model("User",userSchema,'listofusers');