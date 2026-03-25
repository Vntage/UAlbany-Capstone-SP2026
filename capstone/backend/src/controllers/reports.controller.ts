import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middleware/verifySession";
import pool from "../config/db"

//need to figure out how to generate the report