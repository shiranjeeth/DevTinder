const validator = require('validator');

const validateSignUpData = (req)=>{
const {firstName,lastName,emailId,password} = req.body
if(!firstName || !lastName){
    throw new Error("Name is not valid");
}else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid");
}else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not valid");
}

}


// Validate the Edit profile
 const validateEditProfile=(req)=>{
     const allowedEditedFields = [
        "firstName",
        "lastName",
        "age",
        "gender"
     ]
     const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditedFields.includes(field));
     return isEditAllowed;
 }

 const validateEditProfilePassword = async (password)=>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
 }
module.exports = {
    validateSignUpData,
    validateEditProfile,
    validateEditProfilePassword
};
