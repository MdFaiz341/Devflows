import { WebSocket, WebSocketServer } from "ws";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common/common";
import { client } from "@repo/database/client";
import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({port:8080});

type UserInfo = {
    userId : string,
    // roomId : number,
    firstname : string,
    email : string,
    image : string,
    role? : string
}



// type CanvasUserInfo = {
//     userId : number,
//     roomId
// }

const multiUsers = new Map<WebSocket, UserInfo>();    // socket1 -> {userId : A, room1}

const rooms = new Map<number, Set<WebSocket>>();  // room1 -> {socket1, socket2}

const conversation = new Map<number, Set<WebSocket>>();//  <conversationId, {socket1, socket2}>

const socketRooms = new Map<WebSocket, Set<number>>(); //<socket1, <{conversationId-1, conversationId-2}>>

const onlineUsers = new Map<number, Set<string>>();   // <conversationId, <{user1, user2, user3}>>

const groupUsers = new Map<string, WebSocket>();     // <user1, <{socke1}>>

const canvasConversation = new Map<number, Set<WebSocket>>(); //<RoomId, <socket-1, socket-2>>

const canvasRoomOnline = new Map<number,  Map<string, UserInfo>>();   // <roomId, <{user-1, name, image}, {user-2}>>

const canvasSocketRooms = new Map<WebSocket, Set<number>>();// <Socket, <room1, room2..>>


// const canvasUser = new Map<WebSocket, >();

wss.on("connection", async(socket, request)=>{
    socket.on("error", console.error);
    console.log("user connected-ws");

    const cookie = parse(request.headers.cookie || "");
    const token = cookie.accessToken;

    // const url = request.url;
    // const tokenUrl = new URLSearchParams(url?.split('?')[1]);
    // if(!tokenUrl) return;

    // const token = tokenUrl.get("token");

    if(!token){
        socket.close();
        return;
    }
    const userData = await verifyToken(token);
    console.log("token")

    if(!userData || !userData.id){
        socket.close();
        return;
    }

    
    const userId = userData.id;
    console.log("userId--", userId);
    const firstname = userData.firstname;
    const email = userData.email;
    const image = userData.image;
    
    multiUsers.set(socket, { userId, image, firstname, email});
    
    if(!groupUsers.has(userId)){
        groupUsers.set(userId, socket);
        console.log("user-->Socket set");
    }

    console.log("All set");

    socket.on("message", async(data)=>{
        try{
            const parsed = JSON.parse(data as unknown as string);
            console.log("parsed: ", parsed);

            const user = multiUsers.get(socket);
            if(!user) return;

            if(parsed.type === "join_canvasroom"){
                if(!parsed.roomId) return;
                console.log("join_canvasroom-------Server");
                console.log("parsed Data---", parsed);
                joinCanvasRoom(socket, Number(parsed.roomId), user.userId);
            }

            if(parsed.type === "new_Shape"){
                console.log("new_Shape-- ", parsed);
                console.log(parsed);
                console.log("roomId: ", parsed.roomId);
                console.log("pageNo: ", parsed.page);

                const roomIdInt = Number(parsed.roomId);
                console.log("roomIdInt", roomIdInt);

                
                if(!roomIdInt){
                    return;
                }

                const page = await client.page.upsert({
                    where:{
                        roomId_pageNo:{
                            roomId : roomIdInt,
                            pageNo : parsed.page,
                        }
                    },
                    update : {},
                    create:{
                        roomId : roomIdInt,
                        pageNo : parsed.page,
                    }
                })

                // then ceate shape
                const saved = await client.shape.create({
                    data:{
                        id : parsed.shape.id,
                        type : parsed.shape.type,
                        pageId : page.id,
                        data: parsed.shape,
                        userId : user.userId
                    },
                    include: {user:true},
                });

                const payload = JSON.stringify({
                    type : "new_Shape",
                    pageNo : saved.pageId,
                    roomId : page.roomId,
                    shape:saved.data,
                    senderName : user.firstname,
                    senderImage : saved.user.image
                })

                broadCastInCanvas(payload, page.roomId);
            }

            if(parsed.type === "delete_Shape"){
                console.log("delete_Shape-- ", parsed);
                const roomId = Number(parsed.roomId);

                const ownerOfTheShape = await client.shape.findUnique({
                    where:{
                        id : parsed.shapeId,
                    }
                })

                console.log(ownerOfTheShape?.userId);
                console.log(user.userId);

                if(ownerOfTheShape?.userId !== user.userId){
                    socket.send(JSON.stringify({
                        type: "canvas_DeleteShape_notify",
                        message : "You don't have access to delete this shape"
                    }))
                    return;
                }

                const deltedShape = await client.shape.delete({
                    where:{
                        id : parsed.shapeId,
                    },
                    include:{
                        user:true,
                    }
                })

                // broadCast to all;
                const payload = JSON.stringify({
                    type : "delete_Shape",
                    userName : deltedShape.user.firstname,
                    image : deltedShape.user.image,
                    shapeType : deltedShape.type,
                    message: `${deltedShape.user.firstname} deleted ${deltedShape.type}`,
                    page : deltedShape.pageId,
                    roomId,
                    shapeId : deltedShape.id
                })

                broadCastInCanvas(payload, roomId);
                return;
            }

            if(parsed.type === "leave_canvas"){
                console.log("leave_canvas----", parsed);
                const roomId = Number(parsed.roomId);
                const allSocket = canvasConversation.get(roomId);
                allSocket?.delete(socket);
                if(allSocket?.size === 0){
                    canvasConversation.delete(roomId);
                }

                const allUser = canvasRoomOnline.get(roomId)
                // const filterActiveUser = allUser?.filter((val)=>val.userId !== user.userId);

                allUser?.delete(user.userId);

                if(!allUser) return;

                const payload = JSON.stringify({
                    type : "canvasRoom_online",
                    message:{
                        roomId,
                        // onlineUsers : filterActiveUser?.length,
                        users: [...allUser?.values()]
                    }
                })

                broadCastInCanvas(payload, roomId);
            }

            if(parsed.type === "shape_History"){
                console.log("Shape_History--- ", parsed);


                const historyData = await client.page.findUnique({
                    where:{
                        roomId_pageNo:{
                            roomId : Number(parsed.roomId),
                            pageNo : parsed.page,
                        }
                    },
                    include:{
                        shapes:true,
                    }
                })

                socket.send(JSON.stringify({
                    type : "shape_History",
                    historyData,
                }))
                
            }

            if(parsed.type === "leave_conversation"){
                const { conversationId } = parsed;
                if(!conversationId) return;
                console.log("Leave-conversation--", parsed);

                // const room = conversation.get(conversationId);
                // if(!room) return;

                // room?.delete(socket);

                // if(room.size === 0){
                //     conversation.delete(conversationId);

                //     console.log("room deleted", conversationId);
                // }
                // else{
                    // broadCast
                    const usersIdSet = onlineUsers.get(conversationId);
                    usersIdSet?.delete(user.userId)
                    if(usersIdSet?.size === 0){
                        onlineUsers.delete(conversationId);
                    }
                    // leave karne pe message jana chahiye Or Shayad delete_chat se hoga
                
                    // totalUser ka set ko return karado bcz usme active user ka ID hai
                    // and frontend pe map chala kar check kar lenge jo bhi userid match wo online else offline
                    // and uska size bhi top pe dikhane ke liye
                    if(!usersIdSet) return;
                    const totalUserIDs = [...usersIdSet]
                    const activeUser = usersIdSet?.size;
                    const payload = JSON.stringify({
                        type : "totalUser",
                        message: {
                            activeUser,
                            totalUserIDs,
                            conversationId,
                        },
                    })
                    console.log("Leave_conversation hit---");
                    broadCastConversation(payload, conversationId); 
                    
                // }
            }

            if(parsed.type === "joinLiveUser"){
                const {conversationId} = parsed;
                if(!conversationId) return;

                if(!onlineUsers.has(conversationId)){
                    onlineUsers.set(conversationId, new Set());
                }

                onlineUsers.get(conversationId)?.add(user.userId);
                // if(!conversation.has(conversationId)){
                //     conversation.set(conversationId, new Set());
                // }
                // conversation.get(conversationId)?.add(socket);

                const usersIdSet = onlineUsers.get(conversationId);

                if(!usersIdSet) return;
                const totalUserIDs = [...usersIdSet]
                const activeUser = usersIdSet?.size;

                const payload = JSON.stringify({
                    type : "totalUser",
                    message: {
                        activeUser,
                        totalUserIDs,
                        conversationId
                    },
                });

                broadCastConversation(payload, conversationId);
            }

            if(parsed.type === "join_conversation"){
                const {conversationId} = parsed;
                if(!conversationId) return;

                console.log("join-conversation---", parsed);

                joinConversation(conversationId, socket);
            }

            if(parsed.type === "new_message"){
                const {conversationId, text, clientID} = parsed;
                if(!conversationId || !text || !clientID) return;

                const member = await client.conversationMember.findFirst({
                    where:{
                        conversationId,
                        userId : user.userId,
                    }
                })

                if(!member) return;
                console.log("new messae tak ayay--");
                // save in DB
                const savedMessages = await client.message.create({
                    data:{
                        text,
                        conversationId,
                        senderId : user.userId
                    },
                    include:{
                        sender:true,
                        conversation:true,
                    }
                });

                const conversationType = await client.conversation.update({
                    where:{
                        id : conversationId
                    },
                    data : {
                        updatedAt : new Date() 
                    },
                })

                const liveUsers = onlineUsers.get(conversationId);
                const excludeUsers = [...liveUsers!];

                const updateCount = await client.conversationMember.updateMany({
                    where:{
                        conversationId,
                        userId:{
                            notIn : excludeUsers
                        }
                    },
                    data:{
                        unreadCount:{
                            increment : 1
                        }
                    }
                })
                
                const payload = JSON.stringify({
                    type: "new_message",

                    message:{
                        id : savedMessages.id,
                        text : savedMessages.text,
                        createdAt : savedMessages.createdAt,
                        
                        sender : {
                            id : savedMessages.sender.id,
                            firstname : savedMessages.sender.firstname,
                            image : savedMessages.sender.image
                        },
                        conversationId,
                    },
                    clientID,
                });

                // broadcast
                broadCastConversation(payload, conversationId);
            }

            if(parsed.type === "delete_chat"){
                const {conversationId} = parsed;
                console.log("delete_chat", parsed);
                if(!conversationId) return;

                const member = await client.conversationMember.delete({
                    where:{
                        conversationId_userId:{
                            conversationId,
                            userId : user.userId,
                        }
                    },
                    include:{
                        user : true,
                    }
                })

                conversation.get(conversationId)?.delete(socket);
                onlineUsers.get(conversationId)?.delete(user.userId);

                // console.log("conversation-Socket--", conversation.get(conversationId));

                const allRooms = socketRooms.get(socket);
                console.log("allRooms: ", allRooms);
                if(!allRooms?.has(conversationId)) return;

                allRooms.delete(conversationId);

                const savedMessages = await client.message.create({
                    data:{
                        text : `${member.user.firstname} left`,
                        conversationId,
                        senderId : user.userId
                    },
                    include:{
                        sender:true,
                        conversation:true,
                    }
                })
                console.log("delete ke uper")
                const payload = JSON.stringify({
                    type : "delete_chat",
                    message : {
                        id : savedMessages.id,
                        text : `${savedMessages.sender.firstname} left`,
                        createdAt : savedMessages.createdAt,
                        sender : {
                            id : savedMessages.sender.id,
                            firstname : savedMessages.sender.firstname,
                            image : savedMessages.sender.image
                        },
                        conversationId,
                    },
                });

                
                // broadcast
                broadCastConversation(payload, conversationId);

                const live_user = onlineUsers.get(conversationId);
                if(!live_user) return;
                const totalUser = [...live_user];
                const payload2 = JSON.stringify({
                    type : "totalUser",
                    message: {
                        activeUser : live_user.size,
                        totalUserIDs : totalUser,
                        conversationId
                    },
                });

                broadCastConversation(payload2, conversationId);                

                console.log("Yaha tak aaye");
            }

            if(parsed.type === "chatCreation"){
                const {conversationId, data} = parsed;
                // const {groupName, memberIds} = parsed;
                if(!conversationId || !data) return;

                // if(!groupName || memberIds.length === 0) return;
                // console.log("groupName:", groupName);
                // console.log("membersIds:", memberIds);

                if(!conversation.has(conversationId)){
                    conversation.set(conversationId, new Set());
                };

                // if(!groupUsers.has(user.userId)){
                //     console.log("Group User me set nahi tha----");
                //     groupUsers.set(user.userId, socket);
                // }

                // friendDetails abhi nahi zustand me filter karna hoga Shayd bcz yaha filter kar diya faiz ko to sab ko bina faiz ke friend pahunchega like harkirat ko harkirat bhi pahunch jayega but faiz pahunchna chiye the 
                // so i think UI pe member ko filter karna much better according to their user.id;

                // member open karke dekhlo same User dikh raha hai or curr userId ke ilava other member dikh rahe hai 

                // http me dm/creation ko fix karlo like "group/create" ki tarah only return data ={}; not whole Object See "group/create"

                // const group = await createGroup(groupName, memberIds, socket);
                // if(!group) return;

                // const data = {
                //     conversationId : group.id,
                //     createdAt : group.createdAt,
                //     image : group.image || null,
                //     member : group.members,
                //     lastMessage : "",
                //     type : group.type,
                //     name : group.name,
                //     updatedAt : group.updatedAt,
                // }

                // if(!conversation.has(data.conversationId)){
                //     conversation.set(data.conversationId, new Set());
                // };

                const savedMessages = await client.message.create({
                    data:{
                        text : `${user.firstname} joined you`,
                        conversationId : data.conversationId,
                        senderId : user.userId
                    },
                    include:{
                        sender:true,
                    }
                })

                // 1)  Event listner fail ho jaa rha hai baar baar when i am creating new-group/DM maybe groupUsers me socket insert nahi ho raha hai
                //     Or apna Event-listner sahi se kaam nahi kar rah hai
                // 2)  Jab user dlete kar rah hai chat ko to other user ko member me wo deleted user nahi dikhna chaiye so filter that user

                console.log("members: ", data.member);

                data.member.forEach((ids:any)=>{
                    // console.log("broadcast to:",ids.userId, "socket:", groupUsers.get(ids.userId));
                    console.log("conversationId--- ", conversationId);
                    console.log("data==conversationId--- ", data.conversationId);
                    const clientSocket = groupUsers.get(ids.userId);
                    if(!clientSocket) return;
                    console.log("hiii");

                    conversation.get(data.conversationId)?.add(clientSocket);
                    if(!socketRooms.has(clientSocket)){
                        console.log("SocketRoom me present nahi tha---");
                        socketRooms.set(clientSocket, new Set());
                    }
                    socketRooms.get(clientSocket)!.add(data.conversationId);

                    clientSocket.send(JSON.stringify({
                        type : "chatCreation",
                        conversationId : data.conversationId,
                        message:{
                            data : {
                                // conversationId : data.conversationId,
                                ...data
                            }
                        }
                    }))
                })
            }

            if(parsed.type === "typing"){
                const {conversationId} = parsed;
                if(!conversationId) return;

                // broadcast into that conversation
                const payload = JSON.stringify({
                    type : "typing",
                    message : {
                        isTyping : true,
                        userId : user.userId,
                        conversationId,
                    }
                })

                // broadcast
                const rooms = conversation.get(conversationId);
                if(!rooms) return;
                rooms.forEach((client)=>{
                    if(client !== socket && client.readyState === WebSocket.OPEN){
                        client.send(payload);
                    }
                })
            }

            if(parsed.type === "stop_typing"){
                const {conversationId} = parsed;
                if(!conversationId) return;

                // broadcast into that conversation
                const payload = JSON.stringify({
                    type : "stop_typing",
                    message : {
                        isTyping : false,
                        userId : user.userId,
                        conversationId,
                    }
                })
                // broadcast
                const rooms = conversation.get(conversationId);
                if(!rooms) return;
                rooms.forEach((client)=>{
                    if(client !== socket && client.readyState === WebSocket.OPEN){
                        client.send(payload);
                    }
                })
            }

            if(parsed.type === "history"){
                const {conversationId} = parsed;
                if(!conversationId) return;
                
                const oldMessages = await client.message.findMany({
                    where:{
                        conversationId,
                        // we can add pagination when user want old messages
                    },
                    include:{
                        sender:true,
                    },
                    orderBy:{
                        createdAt : "desc"
                    },
                    take: 50,
                })  

                oldMessages.reverse();
                
                socket.send(JSON.stringify({
                    type : "history",
                    message:oldMessages.map((m)=>({
                        id : m.id,
                        text : m.text,
                        createdAt : m.createdAt,
                        sender : {
                            id : m.sender.id,
                            firstname : m.sender.firstname
                        },
                    })),
                    conversationId,
                }))
            }

            if(parsed.type === "close"){
                // handleDisconnect(socket, parsed.roomId);
                console.log("user disconnected TYPE-CLOSE");
            }
        }
        catch(err){
            console.log(err);
            console.error("Error: ", err);
            socket.close();
        }
    });

    socket.on("close", (code, reason)=>{
        const user = multiUsers.get(socket);
        if(!user) return;
        console.log("user disconnected");
        // When websocket disconnects Remove socket from ALL rooms.
        // remove from allrooms to prevent memory leak
        groupUsers.delete(user.userId);

        const rooms = socketRooms.get(socket);
        console.log("user disconnected server", code, reason.toString());
 
        rooms?.forEach((conversationId)=>{
            const roomsSocket = conversation.get(conversationId);
            const LiveUser = onlineUsers.get(conversationId);

            LiveUser?.delete(user.userId);
            roomsSocket?.delete(socket);

            if(LiveUser?.size === 0){
                onlineUsers.delete(conversationId);
            }
            if(roomsSocket?.size === 0){
                conversation.delete(conversationId);
            }
        })

        multiUsers.delete(socket);

        const allCanvasRooms = canvasSocketRooms.get(socket);
        allCanvasRooms?.forEach((roomId)=>{
            const allSockets = canvasConversation.get(roomId);
            allSockets?.delete(socket);
            if(allSockets?.size === 0){
                canvasConversation.delete(roomId);
            }

            const canvasOnline = canvasRoomOnline.get(roomId);
            // const filterActiveUser = canvasOnline?.filter((val)=>val.userId !== user.userId);
            canvasOnline?.delete(userId);
        })
    })

})


async function joinCanvasRoom(socket:WebSocket, roomId:number, userId:string) {
    console.log("userId-- ", userId);
    console.log("roomId-- ", roomId);
    const userExist = await client.canvasMember.findUnique({
        where:{
            roomId_userId:{
                roomId,
                userId
            }
        },
        include:{
            user : {
                select:{
                    image:true,
                    firstname : true,
                    email : true,
                }
            }
        }
    })

    if(!userExist){
        socket.send(JSON.stringify({
            type: "error",
            message: "Unauthorized"
        }))
        return;
    }

    if(!canvasConversation.has(roomId)){
        canvasConversation.set(roomId, new Set());
    }
    canvasConversation.get(roomId)?.add(socket);

    if(!canvasRoomOnline.has(roomId)){
        canvasRoomOnline.set(roomId, new Map());
    }

    canvasRoomOnline
    .get(roomId)!
    .set(userId, {
        userId,
        image : userExist.user.image,
        firstname : userExist.user.firstname,
        email : userExist.user.email,
        role : userExist.role
    });

    if(!canvasSocketRooms.has(socket)){
        canvasSocketRooms.set(socket, new Set());
    }
    canvasSocketRooms.get(socket)?.add(roomId);

    const totalUserIDs = canvasRoomOnline.get(roomId);
    if(!totalUserIDs) return;

    console.log("totalUser---", totalUserIDs);
    // const onlineUsers = [...totalUserIDs];

    const payload = JSON.stringify({
        type : "canvasRoom_online",
        message:{
            roomId,
            // onlineUsers : totalUserIDs.length,
            users: [...totalUserIDs.values()]
        }
    })

    broadCastInCanvas(payload, roomId);

    // 1. history hanlder add karo canvasSynmanager me so when user comes firt time it restore all shape
    // 2. remove shape and update shape wala bhi add kar sakte ho


    const historyData = await client.page.findUnique({
        where:{
            roomId_pageNo:{
                roomId,
                pageNo : 1,
            }
        },
        include:{
            shapes:true,
        }
    })

    socket.send(JSON.stringify({
        type : "shape_History",
        historyData,
    }))
}

function broadCastInCanvas(payload:string, roomId:number){
    const membersSocket = canvasConversation.get(roomId);
    if(!membersSocket) return;

    membersSocket.forEach((clientSocket)=>{
        if(clientSocket.readyState === WebSocket.OPEN){
            clientSocket.send(payload);
        }
    })
}

async function joinConversation(conversationId : number, socket : WebSocket){
    const user = multiUsers.get(socket);
    console.log("JoinConevrsation func hit uper me---");
    if(!user) return;

    const member = await client.conversationMember.findFirst({
        where:{
            conversationId,
            userId : user.userId,
        }
    })

    if(!member){
        socket.send(JSON.stringify({
            type: "error",
            message: "Unauthorized"
        }));
        return;
    }

    if(!groupUsers.has(user.userId)){
        groupUsers.set(user.userId, socket);
    }

    if(!conversation.has(conversationId)){
        conversation.set(conversationId, new Set());
    }

    conversation.get(conversationId)?.add(socket);

    if(!socketRooms.has(socket)){
        socketRooms.set(socket, new Set());
    }

    socketRooms.get(socket)?.add(conversationId);

    if(!onlineUsers.has(conversationId)){
        onlineUsers.set(conversationId, new Set());
    }

    onlineUsers.get(conversationId)?.add(user.userId);


    const usersIdSet = onlineUsers.get(conversationId);
    if(!usersIdSet) return;
    const totalUserIDs = [...usersIdSet]
    const activeUser = usersIdSet?.size;

    const payload = JSON.stringify({
        type : "totalUser",
        message: {
            activeUser,
            totalUserIDs,
            conversationId
        },
    });
    console.log("Join wala function hit hua----");
    broadCastConversation(payload, conversationId);
}

// async function createGroup(groupName:string, memberIds:number[], socket:WebSocket){
//     const user = multiUsers.get(socket);
//     if(!user) return;
//     const group = await client.conversation.create({
//                     data:{
//                         type : "Group",
//                         name : groupName,
//                         image : `https://api.dicebear.com/5.x/initials/svg?seed=${groupName}`,
                        
//                         members:{
//                             create: [
//                                 {userId : user.userId},
                                
//                                 // other members
//                                 ...memberIds.map((id: number) => ({
//                                     userId: id,
//                                 })),
//                             ]
//                         }
//                     },
//                     include:{
//                         members : {
//                             include:{
//                                 user : {
//                                     select:{
//                                         id : true,
//                                         createdAt : true,
//                                         firstname : true,
//                                         email : true,
//                                         image : true,
//                                     }
//                                 }
//                             }
//                         },
//                     }
//                 })

//                 await client.conversation.update({
//                     where:{
//                         id : group.id,
//                     },
//                     data:{
//                         updatedAt : new Date(),
//                     }
//                 })
    
//                 return group;
// }


function broadCastConversation(payload : string, conversationId:number){
    const roomSockets = conversation.get(conversationId);
    // console.log("roomSockets--", roomSockets);
    if(!roomSockets) return;
    // console.log("BROADCASTING", conversationId);

    roomSockets.forEach((clientSocket)=>{
        // if(clientSocket.readyState === WebSocket.OPEN){
        // }
        // websocket se connect bas ho jaye ham usko broadcast karte jayega bcz initially 
        // hitted joi_conversation on dashboard button (chat-rooms) so socket connected now broadcast
        // freely and i have removed leave conversation bcz when user remove from Map of conversation
        // then new meesgae not appaer at top when friend send message

        clientSocket.send(payload);
    });

    console.log("Server send Back-- ", payload);
}


// function handleDisconnect(socket:WebSocket, roomId:number){
//     const user = multiUsers.get(socket);
//     if(!user) return;
//     if(user?.roomId.includes(roomId)){
//         const restRoom = user.roomId.filter((v) => v !== roomId);
//         user.roomId = restRoom;
//         const room = rooms.get(roomId);
//         if(!room) return;
//         room.delete(socket);
//         if(room.size == 0){
//             rooms.delete(roomId);
//         }
//         const payload = JSON.stringify({
//             type: "disconnected",
//             message : `${user.firstname+ " " +user.lastname} disconnected`,
//             userID: user.userId
//         })
//         broadCast(roomId, payload, user.userId);
//     }
// }


// function broadCast(roomId:number, payload:string, senderId:number){
//     const room = rooms.get(roomId);
//     if(!room) return;

//     room.forEach((clientSocket)=>{
//         const userInRoom = multiUsers.get(clientSocket);

//         if(userInRoom && userInRoom.userId != senderId && clientSocket.readyState == WebSocket.OPEN){
//             clientSocket.send(payload);
//         }
//     })
// }

async function verifyToken(token:string):Promise<JwtPayload | null> {
    try{
        const decode = jwt.verify(token, JWT_SECRET);
        if(!decode ||!(decode as JwtPayload).id){
            return null;
        }

        return decode as JwtPayload;
    }
    catch(e){
        console.log(e);
        return null;
    }
}