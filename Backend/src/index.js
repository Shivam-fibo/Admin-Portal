import { app } from "./app.js";
import ConnetDB from "./db/database.js";
import dotenv from 'dotenv'


dotenv.config();

ConnetDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) =>{
    console.log("MongoDB connetion failed", err)
})