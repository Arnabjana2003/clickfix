import {Router} from "express"
import { handleChatbotMsg } from "../../controllers/chatbot.controller"

const chatbotRouter = Router()

chatbotRouter.get("/reply", handleChatbotMsg)

export default chatbotRouter