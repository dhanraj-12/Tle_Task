import express, { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

const Siginrouter = express.Router();

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const JWT_SECRET = process.env.JWT_SECRET || "MYSECRET";

const SigninHandler = async (req: Request, res: Response) => {
  try {
    const parsedData = signinSchema.parse(req.body);
    const { email, password } = parsedData;
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Now safe to access user.password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,

    );

    res.json({ message: "Signin successful", token });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    }

    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Attach POST route
Siginrouter.post("/signin", SigninHandler);

export default Siginrouter;
