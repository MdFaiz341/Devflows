

export const userSendMessage = (
    socket : WebSocket, 
    payload: {
        conversationId : number, 
        text:string,
        clientID : string
    }
)=>{

    socket.send(JSON.stringify({
        type : "new_message",
        ...payload,
    }))
}


export const sendUserTyping = (
    socket : WebSocket,
    type: string,
    payload : {
        conversationId : number,
    }
)=>{
    socket.send(JSON.stringify({
        type,
        ...payload
    }))
}


export const joinUser = (
    socket : WebSocket,
    payload : {
        conversationId : number
    }
)=>{

    socket.send(JSON.stringify({
        type : "join_conversation",
        ...payload
    }))
}

export const chatHistory = (
    socket : WebSocket,
    payload : {
        conversationId : number
    }
)=>{

    socket.send(JSON.stringify({
        type : "history",
        ...payload
    }))
}


export const deleteConversation = (
    socket : WebSocket,
    payload : {
        conversationId : number
    }
)=>{

    socket.send(JSON.stringify({
        type : "delete_chat",
        ...payload
    }))
}

export const chatCreation = (
    socket : WebSocket,
    payload : {
        conversationId : number,
        data : any,
        // data : {
        //     groupName : string,
        //     memberIds : number[],
        // }
    }
)=>{

    socket.send(JSON.stringify({
        type : "chatCreation",
        ...payload
    }))
}