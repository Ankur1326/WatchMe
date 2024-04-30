import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware"

const router = Router()
router.use(verifyJWT)

router.route("/video/:videoId").post(toggleVideoLike)

