import {body,validationResult} from "express-validator"

const validate = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            message:"Validation error",
            sucess:false,
            error:errors.array()
        })
    }
    next();
}
const registerValidation =[
   body("username").isString().notEmpty().withMessage("Username not valid"),
   body("email").isEmail().withMessage("Email not valid"),
   body("password").isString().isLength({min:6},{max:12}).withMessage("Password must be at least 6 or atmost 12 characters long"),
   validate
]

export default registerValidation;