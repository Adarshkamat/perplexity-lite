import userModel from "../model/user.models.js"
import {sendEmail} from "../services/mail.service.js"
export async function registerUser(req,res,next){
    const {username,email,password} = req.body;

    const userAlreadyExists = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(userAlreadyExists){ 
        return res.status(400).json({
            message:"User already exists",
            sucess:false,
            error:"User already exists"
     } )
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    await sendEmail({
        from: process.env.GOOGLE_USER,
        to: user.email,
        subject: "Welcome to Our App", 
        html: `<p>Hello <strong>${user.username}</strong>,</p>
        <p>Welcome to our app!<strong>Perplexity</strong></p>
        <p>Thank you for registering!</p>`
    });

    return res.status(201).json({
        message:"User created successfully",
        sucess:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}


