import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/router"
import { initDB } from "./config/dbInit";
import pool from "./config/db";
import authenticateToken from "./middleware/authenticateToken";

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

initDB(); //generate missing tables
//connect to SQL database afterwards
pool.connect().then(() => console.log("Connected to SQL database"))
.catch((err) => console.error("Database connection error: ", err))

//server setup
app.listen(process.env.PORT || 8080, () =>{
    console.log(`Server running on ${process.env.PORT || 8080}`)
})