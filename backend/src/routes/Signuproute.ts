import { Request, Response } from "express";
import express from "express";
import UserModel from "../models/UserModel";
import { z } from "zod"
import bcrypt from "bcrypt";

const Signuprouter = express.Router();

const signuschema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be atleast 6 charachter long")
})

const Signinhandler = async (req: Request, res: Response) => {


    try {
        const parsebody = signuschema.parse(req.body);
        const { email, password } = parsebody;

        const existinguser = await UserModel.findOne({ email });
        if (existinguser) {
            res.status(400).json({
                error: "User already exist"
            })
        }

        const hashedpassword = (await bcrypt.hash(password, 10)).toString();

        await UserModel.create({
            email,
            password: hashedpassword
        })

        res.status(200).json({
            message: "Signedup Sucessfully"
        })
    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(400).json({
                error: e.errors
            })
        }

        console.error("Signup error", e);
        res.status(500).json({
            error: "Internal server error"
        })
    }

}


Signuprouter.post("/signup", Signinhandler);
export default Signuprouter;