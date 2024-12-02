const express = require("express")
const app = express();
const connectionDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRoter.js");
const requestRouter = require("./routes/requestRouter.js");

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
connectionDB()
.then(()=>{
  console.log("Database connceted sucessfully")
  app.listen(7777,()=>{
    console.log("Server is listening on port 7777");
  })
}).catch((err)=>{
  console.err("Database cannot be connected sucessfully")
})






















