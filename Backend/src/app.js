import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/auth.middleware.js";
import { registerUser, loginUser, logOutUser, getUser } from "./controller/user.controller.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Define routes directly in `app.js`
app.post('/user/register', registerUser);
app.post('/user/login', loginUser);
app.post('/user/logout', verifyToken, logOutUser);
app.get('getUser', verifyToken, getUser)

export { app };
