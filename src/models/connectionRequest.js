const mongoose = require("mongoose");
const connectionRequestschema = new mongoose.Schema({
    fromUserId : {
         type: mongoose.Schema.Types.ObjectId,
         required : true,
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

const connectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestschema);

module.exports = connectionRequestModel;