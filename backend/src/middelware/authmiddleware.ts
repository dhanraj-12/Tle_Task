import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const authmiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            error: "Token not provide",
        })
    }

    const decoded = jwt.verify(token as string, JWT_SECRET);

    if (decoded) {
        req.userId = (decoded as JwtPayload).id;
        next();
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}


export default authmiddleware