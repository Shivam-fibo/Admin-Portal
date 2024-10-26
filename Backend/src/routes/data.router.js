import { Router } from "express";
import { dataSave, getAllData } from "../controller/data.controller.js";
const router = Router()

router.post('/userInfo', dataSave)

router.get('/getAllData', getAllData)

export default router
