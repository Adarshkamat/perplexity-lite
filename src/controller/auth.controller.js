import userModel from "../model/user.models.js"
import {sendEmail} from "../services/mail.service.js"
import "dotenv/config"
import jwt from "jsonwebtoken"
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

    const emailVerifyToken = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET_KEY
    )

    await sendEmail({
        from: process.env.GOOGLE_USER,
        to: user.email,
        subject: "Welcome to Our App", 
        html: `<p>Hello <strong>${user.username}</strong>,</p>
        <p>Welcome to our app!<strong>Perplexity</strong></p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerifyToken}">Verify your email</a>
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


export async function verifyEmail(req,res,next){
    const {token} = req.query;

    if(!token){
        res.status(400).json({
            message:"Token is required",
            sucess:false,
            error:"Token is required"
        })
    }

    

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({email:decoded.email})

    if(!user){
        return res.status(400).json({
            message:"Invalid token",
            sucess:false,
            error:"Invalid token"
        })
    }
    if(user.verified){
        html=`<p>Hello <strong>${user.username}</strong>,</p>
        <p>Your email is already verified! You can log in to your account.</p>
        <p>Thank you for verifying your email!</p>`
    }
    user.isVerified = true;
    await user.save();

    html = `<p>Hello <strong>${user.username}</strong>,</p>
    <p>Your email has been verified successfully! You can now log in to your account.</p>
    <p>Thank you for verifying your email!</p>`

    res.send(html);
    return res.status(200).json({
        message:"Email verified successfully",
        sucess:true,
    })
   
}


export async function loginUser(req,res){
    const {username,email,password} = req.body;

    const user = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        return res.status(400).json({
            message:"Invalid credentials",
            sucess:false,
            error:"Invalid credentials"
        })
    }
    if(!user.verified){
        return res.status(400).json({
            message:"Please verify your email first",
            sucess:false,
            error:"Please verify your email first"
        })
    }

    const matchPassword = await user.comparePassword(password)

    if(!matchPassword){
        return res.status(400).json({
            message:"Invalid password or email",
            sucess:false,
            error:"Invalid password or email"
        })
    
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username,
        email:user.email,
    }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })

    res.cookie("token", token );

    return res.status(200).json({
        message:"Login successful",
        sucess:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })
}


export async function getMe(req,res){
   const id = req.user.id;
   const user = await userModel.findById(id)
   if(!user){   
    return res.status(404).json({
        message:"User not found",
        sucess:false,
        error:"User not found"
    })
   }
    return res.status(200).json({   
        message:"User found",
        sucess:true,
        user:{      
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })

}
