import { Router } from "express";

import { registerUser, loginUser, logOutUser, getUser } from "../controller/user.controller.js";
import {verifyToken} from '../middleware/auth.middleware.js'
import { dataSave } from "../controller/data.controller.js";

const router = Router();


router.post('//login', loginUser);
router.post('//register', registerUser)
router.post('//logout', verifyToken, logOutUser);
router.get('/getUser', verifyToken, getUser)
router.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
     });
router.post('/api/user', dataSave)



export default router
