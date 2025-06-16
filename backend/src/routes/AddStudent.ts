import express from "express"
import { Request, Response } from "express";
import StudentModal from "../models/StudentModel";
import cfhandleinfo from "../helpers/cfhandleinfo";
import authmiddleware from "../middelware/authmiddleware";

const Addstudentroute = express.Router();

const Addstudentroutehandler = async (req : Request, res : Response) => {
    const userid = req.userId;
    const name = req.body.name;
    const email = req.body.email;
    const phnumber = req.body.phnumber;
    const cfhandle = req.body.cfhandle;
    const cfinfo = await cfhandleinfo(cfhandle);


    const MaxRating = cfinfo.maxRating;
    const CurrRating = cfinfo.rating;

    if(!cfinfo) {
        res.status(400).json({
            message : "Username invalid no user exist"
        });
    }else {
        try {
            await StudentModal.create({
                name,
                email,
                phnumber,
                cfhandle,
                MaxRating,
                CurrRating,
                userid,
            })

            res.status(200).json({
                message : "Student detailed added succesfully"
            })
        }catch(e) {
            console.error(e);
        }
    } 

    
}

Addstudentroute.post("/add",authmiddleware, Addstudentroutehandler);
export default Addstudentroute