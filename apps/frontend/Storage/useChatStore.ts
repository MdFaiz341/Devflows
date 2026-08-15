
import { create } from "zustand";


interface Message {
    id?: number,   // message ID
    text : string,
    createdAt : string,
    sender : {
        id : number,   // user ID
        firstname : string
        image? : string
    },
    conversationId : number,
    clientID? : string,   // just for to show Insatant message
    sending? : boolean,
}

interface JoinedUserType{
    activeUser : number,
    totalUserIDs : number[],
}

interface sidebarConversationType {
    conversationId : number,
    createdAt : string,
    image : string | null,
    member : [{
        user :{
            id : number,
            firstname : string,
            email : string,
            image : string,
        },
    }],
    lastMessage : string,
    type : "DM" | "Group",
    name : string | null,
    updatedAt : string,
}

interface ChatStore {
    backendConversation : [],
    setBackendConversation : (data : [])=>void,

    messageByConversation : Record<number, Message[]>

    setMessages : (
        conversationId:number,
        messages:Message[]
    )=>void,
    addMessage : (
        conversationId:number,
        message : Message
    )=>void,
                                // < ConversationId2 : lastMessagess >
    sidebarDefaultConversation : Record<number, sidebarConversationType>,
    setSidebarDefaultConversation : (
        conversationId : number, 
        data : sidebarConversationType
    )=>void,

    updateConversationPreview : (
        conversationId : number,
        text : string,
        createdAt : string,
    )=>void,

    sideConversationOrder : number[],   //[conversatId1, conversatId2, conversatId3]
    setSideConversationOrder : (conversationIDs : number[])=>void
    updateCurrentChatToTop : (
        conversationId:number
    )=>void,   // conversationId

    unreadMessage : Record<number, number> // <conversationId, count>
    setUnreadMessage : (conversaionId:number, val:number)=>void,
    incrementCount : (
        conversationId:number, 
    )=>void,
    clearCount : (
        conversationId:number,
    )=>void,

    addInstantMessage: (
        conversationId:number, 
        message:Message
    )=>void
    replaceInstantMessage : (
        conversationId : number,
        message : Message,
        clientID : string
    )=> void

    joinedUser : Record<number, JoinedUserType>,
    setJoinedUser : (conversationId:number, data : JoinedUserType)=>void

    typing : Record<
        number, 
        Record<number, boolean>
    >
    setTyping : (conversationId:number, userId:number, isTyping : boolean)=>void

    selectedConversation : number | null
    setSelectedConversation : (conversationId:number | null)=>void
}

export const useChatStore = create<ChatStore>(
    (set) => ({
        backendConversation : [],

        setBackendConversation : (data)=>set({backendConversation : data}),

        joinedUser : {
            activeUser : 0,
            totalUserIDs : [],
        },

        sidebarDefaultConversation : {},
        sideConversationOrder : [],

        unreadMessage : {},

        typing : {},
        selectedConversation : null,
        messageByConversation : {},

        setMessages : (conversationId, messages) => set((state)=>({
            messageByConversation : {
                ...state.messageByConversation,
                [conversationId] : messages
            }
        })),

        addMessage : (conversationId, message) => set((state)=> {
            const storeMessages = state.messageByConversation[conversationId] || [];
            
            const exist = storeMessages.some((v) =>v.id === message.id || (v.clientID && v.clientID === message.clientID))

            if(exist){
                return state;
            }

            return{
                messageByConversation : {
                    ...state.messageByConversation,
                    [conversationId] : [
                        ...storeMessages,
                        message,
                    ]
                }
            }
        }),
 
        // add message Intant on UI
        addInstantMessage : (conversationId, message)=> set((state)=>({
            messageByConversation: {
                ...state.messageByConversation,

                [conversationId] : [
                    ...(state.messageByConversation[conversationId] || []),
                    {
                        ...(message),
                        sending : true,
                    }
                ]
            }
        })),

        replaceInstantMessage : (conversationId, realmessage, clientID) => set((state)=>({
            messageByConversation : {
                ...state.messageByConversation,

                [conversationId] : 
                    (state.messageByConversation[conversationId] 
                        || []).map((msg)=>(
                            msg.clientID === clientID 
                            ?   {
                                    ...(realmessage),
                                    sending : false,
                                }
                            : msg
                        ))
            }
            
        })),
        
        setJoinedUser : (conversationId, data)=> set((state)=>({
            joinedUser:{
                ...state.joinedUser,
                [conversationId] : data,
            }
        })),

        setTyping : (conversationId, userId, isTyping) => set((state)=>{

            const roomTyping = {...(state.typing[conversationId])}

            if(isTyping){
                roomTyping[userId] = true
            }
            else{
                delete roomTyping[userId]
            }

            return {
                typing : {
                    ...state.typing,
                    [conversationId] : roomTyping
                } 
            }
        }),

        setSelectedConversation: (conversationId) =>set({selectedConversation : conversationId}),

        updateCurrentChatToTop : (conversationId) => set((state)=>({

            sideConversationOrder : [
                conversationId,

                ...state.sideConversationOrder.filter((v)=>v !== conversationId)
            ]
        })),

        setSidebarDefaultConversation : (conversationId, data) => set((state)=>({
            sidebarDefaultConversation : {
                ...state.sidebarDefaultConversation,

                [conversationId] : data,
            }
        })),

        updateConversationPreview : (conversationId, text, createdAt)=>set((state)=>({
           sidebarDefaultConversation: {
                ...state.sidebarDefaultConversation,
                [conversationId]: {
                    ...state.sidebarDefaultConversation[conversationId] as sidebarConversationType,
                    lastMessage: text,
                    updatedAt : createdAt,
                },
            },
        })),

        setSideConversationOrder : (conversationIDs)=>set({sideConversationOrder : conversationIDs}),

        incrementCount : (conversationId)=>set((state)=>({
            unreadMessage : {
                ...state.unreadMessage,
                [conversationId] : (state.unreadMessage[conversationId] || 0) + 1,
            }
        })),

        clearCount : (conversationId)=>set((state)=>{
            const unreadMessage = {...state.unreadMessage};
            delete unreadMessage[conversationId];

            return{
                unreadMessage    
            }
        }),

        setUnreadMessage: (conversationId, val)=>set((state)=>({
            unreadMessage : {
                ...state.unreadMessage,
                [conversationId] : val
            }
        })),

    })
    
)