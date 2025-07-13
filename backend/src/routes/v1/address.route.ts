import { Router } from "express"
import authMiddleware from "../../middlewares/auth.middleware"
import { addNewAddress } from "../../controllers/address.controller"

const addressRouter = Router()

addressRouter.post("/",authMiddleware,addNewAddress)

export default addressRouter