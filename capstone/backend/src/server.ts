import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db"

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 8080, () =>{
    console.log(`Server running on ${process.env.PORT || 8080}`)
})
