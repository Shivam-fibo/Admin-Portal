import express, { urlencoded } from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.router.js"
const app = express();


app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Define routes directly in `app.js`
app.use('/', userRoute)

export { app };
