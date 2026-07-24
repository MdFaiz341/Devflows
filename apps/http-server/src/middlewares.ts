import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";


export const middleware = async(req:Request, res:Response, next:NextFunction)=>{
    const token = req.cookies?.accessToken;

    if(!token){
        return res.status(401).json({ 
            message: "Unauthorized" 
        });
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.userId = (decode as JwtPayload).id;
        next();
    }
    catch(e){
        console.log(e);
        return res.status(401).json({ message: "Invalid token" });
    }
}