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
    firstname : string,
    email : string,
    image : string,
    role? : string
}


//======================================= socket1 -> {userId : A, room1} ================================================
const multiUsers = new Map<WebSocket, UserInfo>();

//====================================== <conversationId, {socket1, socket2}> ================================
const conversation = new Map<number, Set<WebSocket>>();

//====================================== <socket1, <{conversationId-1, conversationId-2}>> ==========================
const socketRooms = new Map<WebSocket, Set<number>>(); 

//====================================== <conversationId, <{user1, user2, user3}>> ==============================
const onlineUsers = new Map<number, Set<string>>();   

//====================================== <user1, <{socke1}>> =====================================================
const groupUsers = new Map<string, WebSocket>();     

//====================================== <RoomId, <socket-1, socket-2>> ============================================
const canvasConversation = new Map<number, Set<WebSocket>>(); 

//====================================== <roomId, <{user-1, name, image}, {user-2}>> ===================================
const canvasRoomOnline = new Map<number,  Map<string, UserInfo>>();   

//====================================== <Socket, <room1, room2, room3 >> ============================================
const canvasSocketRooms = new Map<WebSocket, Set<number>>();


wss.on("connection", async(socket, request)=>{
    socket.on("error", console.error);

    const cookie = parse(request.headers.cookie || "");
    const token = cookie.accessToken;

    if(!token){
        socket.close();
        return;
    }
    const userData = await verifyToken(token);

    if(!userData || !userData.id){
        socket.close();
        return;
    }

    
    const userId = userData.id;
    const firstname = userData.firstname;
    const email = userData.email;
    const image = userData.image;
    
    multiUsers.set(socket, { userId, image, firstname, email});
    
    if(!groupUsers.has(userId)){
        groupUsers.set(userId, socket);
    }


    socket.on("message", async(data)=>{
        try{
            const parsed = JSON.parse(data as unknown as string);

            const user = multiUsers.get(socket);
            if(!user) return;

            if(parsed.type === "join_canvasroom"){
                if(!parsed.roomId) return;
                joinCanvasRoom(socket, Number(parsed.roomId), user.userId);
            }

            if(parsed.type === "new_Shape"){
                const roomIdInt = Number(parsed.roomId);
                
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
                    pageNo : parsed.page,
                    roomId : page.roomId,
                    shape:saved.data,
                    senderName : user.firstname,
                    senderImage : saved.user.image
                })

                broadCastInCanvas(payload, page.roomId);
            }

            if(parsed.type === "delete_Shape"){
                const roomId = Number(parsed.roomId);

                const ownerOfTheShape = await client.shape.findUnique({
                    where:{
                        id : parsed.shapeId,
                    }
                })

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
                    userId : user.userId,
                    userName : deltedShape.user.firstname,
                    image : deltedShape.user.image,
                    shapeType : deltedShape.type,
                    message: `${deltedShape.user.firstname} deleted ${deltedShape.type}`,
                    page : parsed.page,
                    roomId,
                    shapeId : deltedShape.id
                })

                broadCastInCanvas(payload, roomId);
                return;
            }

            if(parsed.type === "leave_canvas"){
                const roomId = Number(parsed.roomId);
                const allSocket = canvasConversation.get(roomId);
                allSocket?.delete(socket);
                if(allSocket?.size === 0){
                    canvasConversation.delete(roomId);
                }

                const allUser = canvasRoomOnline.get(roomId)

                allUser?.delete(user.userId);

                if(!allUser) return;

                const payload = JSON.stringify({
                    type : "canvasRoom_online",
                    message:{
                        roomId,
                        users: [...allUser?.values()]
                    }
                })

                broadCastInCanvas(payload, roomId);
            }

            if(parsed.type === "shape_History"){

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

                const room = conversation.get(conversationId);
                if(!room) return;

                room?.delete(socket);

                if(room.size === 0){
                    conversation.delete(conversationId);
                }
                // broadCast
                const usersIdSet = onlineUsers.get(conversationId);
                usersIdSet?.delete(user.userId)
                if(usersIdSet?.size === 0){
                    onlineUsers.delete(conversationId);
                }

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

                broadCastConversation(payload, conversationId); 
            }

            if(parsed.type === "joinLiveUser"){
                const {conversationId} = parsed;
                if(!conversationId) return;

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

                broadCastConversation(payload, conversationId);
            }

            if(parsed.type === "join_conversation"){
                const {conversationId} = parsed;
                if(!conversationId) return;

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

                const allRooms = socketRooms.get(socket);
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
            }

            if(parsed.type === "chatCreation"){
                const {conversationId, data} = parsed;
                if(!conversationId || !data) return;

                if(!conversation.has(conversationId)){
                    conversation.set(conversationId, new Set());
                };

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

                data.member.forEach((ids:any)=>{
                    const clientSocket = groupUsers.get(ids.userId);
                    if(!clientSocket) return;

                    conversation.get(data.conversationId)?.add(clientSocket);
                    if(!socketRooms.has(clientSocket)){
                        socketRooms.set(clientSocket, new Set());
                    }
                    socketRooms.get(clientSocket)!.add(data.conversationId);

                    clientSocket.send(JSON.stringify({
                        type : "chatCreation",
                        conversationId : data.conversationId,
                        message:{
                            data : {
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

        // When websocket disconnects Remove socket from ALL rooms.
        // remove from allrooms to prevent memory leak
        groupUsers.delete(user.userId);

        const rooms = socketRooms.get(socket);
 
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
            canvasOnline?.delete(userId);
        })
    })

})


async function joinCanvasRoom(socket:WebSocket, roomId:number, userId:string) {
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

    const payload = JSON.stringify({
        type : "canvasRoom_online",
        message:{
            roomId,
            users: [...totalUserIDs.values()]
        }
    })

    broadCastInCanvas(payload, roomId);


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
    broadCastConversation(payload, conversationId);
}



function broadCastConversation(payload : string, conversationId:number){
    const roomSockets = conversation.get(conversationId);

    if(!roomSockets) return;

    roomSockets.forEach((clientSocket)=>{

        clientSocket.send(payload);
    });
}


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