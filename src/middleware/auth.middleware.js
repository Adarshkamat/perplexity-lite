import jwt from "jsonwebtoken"
import userModel from "../model/user.models.js"

export async function validUser(req,res,next){
    
     const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
            message:"Unauthorized",
            sucess:false,
            error:"Unauthorized"
        })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);


    req.user = decode
    next()
    

}