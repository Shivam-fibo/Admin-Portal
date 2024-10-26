import express, { urlencoded } from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.router.js"
import dataRoute from "./routes/data.router.js"
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
app.use('/user', userRoute);
app.use('/api', dataRoute)
app.get('/', (req, res) =>{
    res.status(200).json("Everything wokring fine!!!")
})

export { app };
