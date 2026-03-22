import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import router from "./routes/router"

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//cookie setup
app.use(cors({
    origin: process.env.CLIENT || "http://localhost:5173"   ,
    credentials: true
}));

//api calls
app.use("/api", router)

//server setup
app.listen(process.env.PORT || 8080, () =>{
    console.log(`Server running on ${process.env.PORT || 8080}`)
})
