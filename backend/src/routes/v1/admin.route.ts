import {Router} from "express"
import { upgradeToAdmin } from "../../controllers/admin.controller"

const adminRouter = Router()

adminRouter.post("/upgrade",upgradeToAdmin)

export default adminRouter