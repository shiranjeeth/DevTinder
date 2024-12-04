const express = require("express")
const app = express();
const cors = require("cors")
const connectionDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const PORT = 7777;

app.use(cors({ origin: "http://localhost:5173",  // whitelist this endpoint to get the user in the cookies also
  credentials: true }));
  
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRoter.js");
const requestRouter = require("./routes/requestRouter.js");
const userRouter = require("./routes/userRouter.js");

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/', userRouter);
connectionDB()
.then(()=>{
  console.log("Database connceted sucessfully")
  app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
  })
}).catch((err)=>{
  console.log("Database cannot be connected" + err)
})






















