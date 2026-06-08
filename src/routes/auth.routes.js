import {Router} from "express"
import {registerUser} from "../controller/auth.controller.js"
import registerValidation from "../validation/auth.validation.js"


const authRouter = Router();

authRouter.post("/register-user",registerValidation,registerUser)

export {authRouter}