const express = require("express")
const app = express();
const connectionDB = require("./config/database.js");
const User = require('./models/user.js');
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require('./middlewares/auth.js');
app.use(express.json());
app.use(cookieParser());


// i can get the params like this 
//http://localhost:777/user/101/shiranjeeth/testing
// app.get("/user/:userId/:name/:password",(req,res)=>{
//     console.log(req.params);
//     res.send("request send");
// });

//Reading Query Parameters
//http://localhost:777/user?userId=101&password=testing
// app.get('/user',(req,res)=>{
//     console.log(req.query)
// res.send("reading Query params");
// })

//GET
// app.get("/user",(req,res)=>{
//     console.log("hey this is get request")
//     res.send("Data Sucessfuly saved to the database");
// })

//POST
// app.post("/user",(req,res)=>{
// res.send("posted sucessfully")
// })

//DELETE
// app.delete("/user",(req,res)=>{
//     res.send("");
// })

// app.use("/user",(req,res,next)=>{
//     console.log("first request");
//     res.send("1st response");
//     next();
//     },(req,res)=>{
//         console.log("second request");
//         res.send("2nd response");
//     }
//     )
    // The above code will throw the error like 
//Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

//USING MIDDLEWARES
// const {adminAuth} = require("./middlewares/auth");
// app.use('/admin',adminAuth);

// app.get('/user',(req,res)=>{
//     res.send("User Data sent")
// })
// app.get('/admin/getAlldata',(req,res)=>{
//     res.send('All data sent sucessfully');
// })

// ERROR HANDLING
// app.get('/throwErr',(req,res)=>{
//     try{
//         throw new Error("abcjhd");
//         res.send("User Data Sent");
//     }
//     catch(err){
//         res.status(500).send("catched by try catch");
//     }
// })


// This will catch all the errors in the page
// app.use('/',(err,req,res,next)=>{
//    if(err){
//     res.status(500).send("something went wrong");
//    }
// })

connectionDB()
.then(()=>{
  console.log("Database connceted sucessfully")
  app.listen(7777,()=>{
    console.log("Server is listening on port 7777");
  })
}).catch((err)=>{
  console.err("Database cannot be connected sucessfully")
})

// sending the data via code 
// app.post('/signup', async (req,res)=>{
//       const user = new User({
//         firstName : "sathish",
//         lastName : "tendulkar",
//         emailId :  "sachinTendulkar@gamil.com",
//         password : "sachin123"
//       })
//       try{
//         await user.save();
//         res.send("User added sucessfully");
//       }catch(err){
//         console.err("Data not saved properly")
//       }
      
//     })




// sending the data via postman  
app.post('/signup', async (req,res)=>{
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

app.post('/login',async(req,res)=>{
try{
 const  {emailId,password} = req.body;  
 const user = await User.findOne({emailId :emailId});
 if(!user){
  throw new Error("Invalid credentials");
 }
 const isPasswordValid = await bcrypt.compare(password,user.password);
 if(isPasswordValid){

  // Create a jwt Token

  const token = await jwt.sign({_id:user._id},"Usersecretkey");
  console.log(token);
    res.cookie("token",token);  // sent the cookie back to the token 

  res.send("Login Sucessful");
 }else{
   res.status(400).send("Something went wrong");
 }
}catch(err){
  console.err("Some thing went wrong" +err.message);
  res.status(400).send("Something went wrong");
}
})

// app.get('/profile', async (req,res)=>{
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
app.get('/profile', userAuth, async (req,res)=>{
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



// GETTING THE DATA OF ALL EMAIL IDs with get Method;
// app.get('/signup',async (req,res)=>{
// const useremails = req.body.emailId;

// try{
//     const user = await User.find({emailId :useremails })
//   res.status(200).send(user);
// }catch(err){
//   res.status(400).send('Something went wrong' + err.message);
// }
// })

// // GETTING THE DATA OF THE USERS;

// app.get("/signup",async(req,res)=>{
// try{
//     const users = await User.find({});
//     if(users.length === 0){
//         res.status(404).send("User not found");
//     }
//     res.status(200).send(users)
// }catch(err){
//     res.status(400).send("Something went wrong"+err.message);
// }
// })


// DELETE AN USER
// app.delete('/signup',async (req,res)=>{
//     const userID = req.body._id;
//     try{
//         const user = await User.findByIdAndDelete(userID);
//         res.status(200).send("User ID deleted")
//     }catch(err){
//         res.status(400).send("Something went wrong");
//     }
// })

//UPDATE  AN USER

// app.patch('/user/:userId',async (req,res)=>{
//     const userId = req.params?.userId;
//     const data = req.body;
//     try{
//       // Validation in Api  (User cannot change the email )

//       const ALLOWED_UPDATES = [
//         "firstName",
//         "lastName",
//         "password",
//         "age",
//       ];
//       const isUpdateAllowed = Object.keys(data).every((k)=>{
//       return ALLOWED_UPDATES.includes(k)});
//       if(!isUpdateAllowed){
//         throw new Error("Updated not allowed");
//       } // Validation finished here 

//        const user = await User.findByIdAndUpdate({_id:userId},data);
//        console.log(user);
//        res.send("sucessfully added");
//     }catch(err){
//      res.status(400).send("something went wrong"+err.message);
//     }
// })






