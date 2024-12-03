const mongoose = require("mongoose");

const connectionRequestschema = new mongoose.Schema({
    fromUserId : {
         type: mongoose.Schema.Types.ObjectId,
         required : true,
         ref : "User"  // created a reference that this fromUserId is from User Model
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    status : {
        type: String,
        required : true,
        enum : {
           values : ["ignored","interested","accepted","rejected"],
           message : `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps : true,
}

);

// this schema code is here to validate the the logged in user can give request to them even 
connectionRequestschema.pre("save",function(next){
   const connectionRequest = this;
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection to the logged in user")
   }
   next();
})

connectionRequestschema.index({fromUserId : 1,toUserId : 1});     //Compound git status indexing  to make the query run very fast
const connectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestschema);

module.exports = connectionRequestModel;