import express from "express"
import {requestHost,getHostRequests,approveHost} from "../controllers/hostController.js"
import {protect,adminOnly} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/request",protect,requestHost)

router.get("/admin",protect,adminOnly,getHostRequests)

router.put("/approve/:id",protect,adminOnly,approveHost)

export default router