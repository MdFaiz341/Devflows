
declare global{
    namespace Express{
        export interface Request{
            userId:string,
        }
    }
}


import express from "express";
import bcrypt from "bcrypt";
import  { client } from "@repo/database/client"
import jwt from "jsonwebtoken";
import cors from "cors";
import { middleware } from "./middlewares";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { LinkGenerator } from "./LinkGenerator";
dotenv.config();


const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3003",
    credentials:true,
}))

app.use(cookieParser());




export enum resStatus{
    "NotFound" = 404,
    "Error" = 500,
    "Success" = 200
}

app.post("/signup", async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
    
        if(!email || !password || !firstname || !lastname){
            return res.status(resStatus.NotFound).json({
                message:"Fill All Details"
            })
        }

        const existUser = await client.user.findFirst({
            where:{
                email,
            },
        });
        
        if(existUser){
            return res.status(resStatus.Error).json({
                message:"Email Already Exist"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await client.user.create({
            data:{
                email,
                password:hashPassword,
                firstname,
                lastname,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`
            }
        })

    
        return res.status(resStatus.Success).json({
            message:"Account created"
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message:"User Not Created!"
        })
    }
})


app.post("/signin", async(req, res)=>{
    try{
        const {email, password} = req.body;
        console.log(email)
        console.log(password)
        if(!email || !password){
            return res.status(resStatus.NotFound).json({
                message: "Fill all credential"
            })
        }
    
        const user = await client.user.findFirst({
            where:{
                email,
            }
        })
        if(!user){
            return res.status(resStatus.NotFound).json({
                message:"User not Exist"
            })
        }
        console.log("hi-------------");
        const verifyPass = await bcrypt.compare(password, user.password);

        if(!verifyPass){
            return res.status(resStatus.Error).json({
                message:"Password Incorrect"
            })
        }
    
        const token = jwt.sign({
            id:user.id,
            firstname: user.firstname,
            lastname: user.lastname,
        }, process.env.JWT_SECRET!, {
            expiresIn:30*60,
        });

        res.cookie("accessToken", token, {
            httpOnly:true,
            sameSite:"lax",
        })
    
        return res.status(resStatus.Success).json({
            message:"Login Successfully",
            token,
            email:user.email,
            firstname:user.firstname,
            lastname: user.lastname,
            image:user.image,
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message:"Login failed"
        })
    }
})

app.post("/link_generation", middleware, async(req, res)=>{
    try{
        const roomId = req.body.roomId;
        console.log("roomId: ", roomId);
        if(!roomId){
            return res.status(resStatus.NotFound).json({
                message: "roomId required"
            })
        }
        const randomString = await LinkGenerator();
        console.log(randomString);

        await client.linkDuration.upsert({
            where:{
                userId : req.userId,
            },
            update:{
                linkVal : randomString,
                roomId,
                createdAt : new Date()
            },
            create:{
                userId : req.userId,
                linkVal : randomString,
                roomId
            },
        })

        const URL = `${randomString}/${req.userId}/${roomId}`
        return res.status(resStatus.Success).json({
            message : "Link generated",
            link : URL,
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message:"Failed to generate the Link"
        }) 
    }
})

app.post("/join_member/:randomLink/:adminId/:roomId", middleware, async(req, res)=>{
    try{
        const adminId = req.params.adminId as string;
        const randomLink = req.params.randomLink;
        const roomId = Number(req.params.roomId);
        console.log("adminId:---", adminId)
        console.log("roomId:---", roomId)
        console.log("randomLink:---", randomLink)

        if(!adminId || !roomId || !randomLink){
            return res.status(resStatus.NotFound).json({
                message: "Invalid Link",
            })
        }

        // // Link expire
        const linkValExist = await client.linkDuration.findUnique({
            where:{
                userId_roomId:{
                    userId : adminId,
                    roomId
                }
            }
        })

        if(!linkValExist){
            return res.status(resStatus.Error).json({
                success:false,
                message: "Link Invalid!"
            })
        }

        const oneHours = 60 * 60 * 1000;
        if(new Date(linkValExist.createdAt).getTime() - new Date().getTime() > oneHours ){
            await client.linkDuration.delete({
                where:{
                    userId_roomId : {
                        userId:adminId,
                        roomId
                    }
                }
            })
            return res.status(resStatus.NotFound).json({
                success:false,
                message: "Link Expired",
            })
        }

        // find ki adminId exist karta hai and usne room create kiya bhi hai ki nahi
        const adminWithRoom = await client.canvasMember.findUnique({
            where:{
                roomId_userId:{
                    roomId,
                    userId: adminId
                }
            }
        })
        if(!adminWithRoom){
            return res.status(resStatus.NotFound).json({
                success:false,
                message: "Link Invalid!"
            })
        }

        const userJoined = await client.canvasMember.create({
            data:{
                userId : req.userId,
                role : "MEMBER",
                roomId,
            }
        })

        return res.status(resStatus.Success).json({
            success:true,
            message: "User Joined", 
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message:"Failed to Join Member"
        })
    }
})

app.post("/createCanvasRoom", middleware, async(req, res)=>{
    try{
        const name = req.body.name;

        const existingName = await client.canvasRoom.findUnique({
            where:{
                name,
            }
        })

        if(existingName){
            return res.status(resStatus.Error).json({
                message:"This name already exist"
            })
        }

        const room = await client.canvasRoom.create({
            data:{
                image : `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
                name,
                members:{
                    create: [
                        {
                            userId : req.userId,
                            role : "ADMIN"
                        },
                    ]
                }
            }
        });

        // const member = await client.canvasMember.create({
        //     data:{
        //         userId : req.userId,
        //         roomId : room.id,
        //         role : "ADMIN"
        //     }
        // })

        return res.status(resStatus.Success).json({
            message:"Room created",
            roomId : room.id
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message:"Failed to create room"
        })
    }
})

app.get("/allCanvasRooms", middleware, async(req, res)=>{
    try{
        const allRooms = await client.canvasRoom.findMany({
            where:{
                members:{
                    some:{
                        userId : req.userId,
                    }
                }
            },
            include:{
                members:{
                    include:{
                        user:{
                            select:{
                                email:true,
                                firstname : true,
                                image : true,
                            }
                        }
                    }
                }
            },
            orderBy:{
                createdAt : "desc"
            }
        });

        return res.status(resStatus.Success).json({
            message: "Succssfully fetched rooms",
            allRooms,
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            success: false,
            message: "Failed to fetch Rooms",
        });
    }
})

// app.get("/allcanvasrooms", middleware, async(req, res)=>{
//     try{
//         const search = req.body.search?.trim();
//         const userId = req.userId;

//         let rooms;

//         if(search != ""){
//             rooms = await client.canvasRoom.findMany({
//                 where:{
//                     adminId:userId,
//                     name: {contains:search, mode:"insensitive"}
//                 }
//             })
//         }
//         else{
//             rooms = await client.canvasRoom.findMany({
//                 where:{
//                     adminId : userId,
//                 },
//                 orderBy:{
//                     id : "desc"
//                 },
//                 select:{
//                     createdAt:true,
//                     name:true,
//                 },
//                 take: 20,
//             });
//         }
        
//         if(!rooms){
//             return res.status(resStatus.NotFound).json({
//                 message:"room not exist"
//             })
//         }
    
//         return res.status(resStatus.Success).json({
//             rooms,
//             message:"All room fetched"
//         })
//     }
//     catch(e){
//         console.log(e);
//         return res.status(resStatus.Error).json({
//             message:"Failed to fetched rooms"
//         })
//     }
// })



app.get("/getShapesAtpage/:roomId/:page", middleware, async(req, res)=>{
    try{
        const roomId = Number(req.params.roomId);
        const page = Number(req.params.page);

        if(!roomId || !page){
            return res.status(resStatus.NotFound).json({
                message: "Page or roomId not found",
                success : false,
            })
        }

        // const roomId = Number(roomIdStr)

        const shapes = await client.page.findUnique({
            where:{
                roomId_pageNo:{
                    roomId,
                    pageNo:page
                }
            },
            include:{
                shapes:true
            }
        })

        console.log("shapes----", shapes);
        return res.status(resStatus.Success).json({
            shapes,
        });
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message:"No shapes"
        })
    }
})

app.post("/group/create", middleware, async(req, res)=>{
    try{
        const name = req.body.groupName;
        const memberIds = req.body.memberIds;

        const group = await client.conversation.create({
            data:{
                type : "Group",
                name,
                image : `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
                
                members:{
                    create: [
                        {userId : req.userId},
                        
                        // other members
                        ...memberIds.map((id: number) => ({
                            userId: id,
                        })),
                    ]
                }
            },
            include:{
                members : {
                    include:{
                        user : {
                            select:{
                                id : true,
                                createdAt : true,
                                firstname : true,
                                email : true,
                                image : true,
                            }
                        }
                    }
                },
            }
        })

        await client.conversation.update({
            where:{
                id : group.id,
            },
            data:{
                updatedAt : new Date(),
            }
        })

        const data = {
            conversationId : group.id,
            createdAt : group.createdAt,
            image : group.image || null,
            member : group.members,
            lastMessage : "",
            type : group.type,
            name : group.name,
            updatedAt : group.updatedAt,
        }

        return res.status(resStatus.Success).json({
            message:"Room created",
            conversation : data,
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message:"Failed to create group Or this name is already exist",
        })
    }
})

app.post("/dm/create", middleware, async(req, res)=>{
    try{
        const email = req.body.email;

        const existingEmail = await client.user.findFirst({
            where:{
                email,
            }
        })

        if(!existingEmail){
            return res.status(resStatus.NotFound).json({
                message: "User not Register"
            })
        }

        if(existingEmail.id === req.userId){
            return res.status(resStatus.NotFound).json({
                message:"Your friend email required here"
            })
        }

        const existDms = await client.conversation.findFirst({
            where:{
                type : "DM",

                AND : [
                    {
                        members : {
                            some : {
                                userId : req.userId
                            }
                        }
                    },
                    {
                        members : {
                            some : {
                                userId : existingEmail.id
                            }
                        }
                    }
                ]
            },
        })

        if(existDms){
            return res.status(resStatus.Error).json({
                success: false,
                message: "Already exist in your contact",
                conversation: existDms,
            });
        }

        const dm = await client.conversation.create({
            data:{
                type : "DM",
                members : {
                    create : [
                        {userId : req.userId},
                        {userId : existingEmail.id}
                    ]
                }  
            },
            include:{
                members : {
                    include:{
                        user : {
                            select:{
                                id : true,
                                createdAt : true,
                                firstname : true,
                                email : true,
                                image : true,
                            }
                        }
                    }
                }
            },
        })

        await client.conversation.update({
            where:{
                id : dm.id,
            },
            data:{
                updatedAt : new Date(),
            }
        })

        const data = {
            conversationId : dm.id,
            createdAt : dm.createdAt,
            image : dm.image || null,
            member : dm.members,
            lastMessage : "",
            type : dm.type,
            name : dm.name || null,
            updatedAt : dm.updatedAt,
        }

        return res.status(resStatus.Success).json({
            success : true,
            message : "Contact added",
            conversation: data,
        })

    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message: "Failed to create contact"
        })
    }
})

app.get("/conversations", middleware, async(req, res)=>{
    try{
        // ye user jis bhi room me hoga un sabhi room ko return karna hai 
        // and jitna bhi dm kiya hai usnko bhi return karna hai

        const allConversation = await client.conversation.findMany({
            where:{
                members:{
                    some : {
                        userId : req.userId,
                    }
                }
            },
            include:{
                members: {
                    include :{
                        user : {
                            select: {
                                id:true,
                                createdAt:true,
                                firstname:true,
                                image:true,
                                email : true,
                            }
                        }
                    }
                },

                messages:{
                    take : 1,
                    orderBy:{
                        createdAt : "desc",
                    }
                }
            },
            orderBy:{
                updatedAt : "desc"
            }
        })

        return res.status(resStatus.Success).json({
            message:"Fetch all conversation",
            conversation : allConversation,
        });
    }
    catch(e){
        console.log(e)
        return res.status(resStatus.Error).json({
            message: "Failed to fetch conversation"
        });
    }
})


app.post("/leaveChat", middleware, async(req, res)=>{
    try{
        const conversationId = req.body.conversationId;

        const member = await client.conversationMember.delete({
            where:{
                conversationId_userId:{
                    conversationId,
                    userId : req.userId,
                }
            },
            include:{
                user : true,
            }
        });

        const savedMessages = await client.message.create({
            data:{
                text : `${member.user.firstname} left`,
                conversationId,
                senderId : req.userId
            },
            include:{
                sender:true,
                conversation:true,
            }
        })

        return res.status(resStatus.Success).json({
            message: "You leaved this conversation successfully",
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message : "Failed to leave conversation"
        })
    }
})


app.put("/clearCount", middleware, async(req, res)=>{
    try{
        const conversationId = req.body.conversationId;

        await client.conversationMember.update({
            where:{
                conversationId_userId:{
                    conversationId,
                    userId : req.userId
                }
            },
            data:{
                unreadCount : 0
            }
        })

        return res.status(resStatus.Success).json({
            message : "successfully clear the count"
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message : "Failed to fetch unread_count"
        })
    }
})


app.post("/message/send", async(req, res)=>{
    try{
        const {text, conversationId, senderId} = req.body;

        const member = await client.conversationMember.findFirst({
            where:{
                conversationId,
                userId:senderId
            },
        })

        if(!member){
            return res.status(resStatus.NotFound).json({
                message: "Not a member",
            })
        }

        const message = await client.message.create({
            data:{
                text,
                senderId,
                conversationId
            },
            include:{
                sender:true
            }
        })

        return res.status(resStatus.Success).json({
            message
        })
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message: "Failed message creation",
        })
    }
})


app.get("/messages/:conversationId", async(req, res)=>{
    try{
        const conversationId = Number(req.params.conversationId);

        const messages = await client.message.findMany({
            where:{
                conversationId,
            },
            include:{
                sender:true
            },
            orderBy:{
                createdAt: "desc"
            }
        })

        return res.json({
            success: true,
            messages,
        });

    } 
    catch (e) {
        console.log(e);
        return res.status(resStatus.Error).json({
            success: false,
            message: "Failed to fetch messages",
        });
    }
})


app.get("/profile", middleware, async(req, res)=>{
    try{
        const userId = req.userId;
        const user = await client.user.findFirst({
            where:{
                id : userId,
            },
            select:{
                contents:true,
                // canvasrooms:true,
                // chatrooms:true,
                messages:true,
                id:true,
                firstname:true,
                lastname:true,
                email:true,
                image:true,
            }
        })

        if(!user){
            return res.status(resStatus.NotFound).json({
                message:"User not found"
            })
        }

        return res.status(resStatus.Success).json({
            message:"User found",
            user
        })
    }
    catch(e){ 
        console.log(e);
        return res.status(resStatus.Error).json({
            message:"Failed to find user"
        })
    }
})

app.post("/logout", async(req, res)=>{
    try{
        const token = req.cookies.accessToken;
        console.log("logout token --- ", token);
        if (!req.cookies || !req.cookies.accessToken) {
            return res.status(400).json({ success: false, message: "No active session found" });
        }

        res.clearCookie("accessToken", {
            httpOnly:true,
            sameSite:"lax"
        })
        console.log("Logout aaya hai");
        return res.status(resStatus.Success).json({ 
            success: true, 
            message: "Logged out successfully." 
        });
    }
    catch(e){
        console.log(e);
        return res.status(resStatus.Error).json({
            message: "Failed to logout"
        })
    }
})



app.listen(4000, ()=>{
    console.log("Srever is up with post 4000")
})

