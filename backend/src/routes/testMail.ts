import express from "express";
import sendMail from "../helpers/sendMail";
import { Request, Response } from "express";
const sendmailrouter = express.Router();

const sendmailhandler = async (req: Request, res: Response) => {
    const { to, name } = req.body;

    if (!to || !name) {
        res.status(400).json({ error: "Missing 'to' or 'name' in request body" });
        return
    }

    try {
        await sendMail(to, name);
        res.json({ success: true, message: `Test mail sent to ${to}` });
    } catch (error) {
        console.error("Error sending test mail:", error);
        res.status(500).json({ error: "Failed to send mail" });
    }
}

sendmailrouter.post("/testmail", sendmailhandler);

export default sendmailrouter;
