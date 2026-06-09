import {Router} from "express"
import {registerUser} from "../controller/auth.controller.js"
import registerValidation from "../validation/auth.validation.js"
import {verifyEmail,getMe} from "../controller/auth.controller.js"
import {validUser} from "../middleware/auth.middleware.js"

const authRouter = Router();

authRouter.post("/register-user",registerValidation,registerUser)

authRouter.post("/verify-email", verifyEmail)

authRouter.get("/get-me",validUser,getMe)

export {authRouter}