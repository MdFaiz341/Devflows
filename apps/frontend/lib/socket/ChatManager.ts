import { useChatStore } from "../../Storage/useChatStore";
import { useStore } from "../../Storage/useStore";
import { socketManager, SocketManager } from "./SocketManager";



class ChatManager{

    private static instance: ChatManager;

    private started = false;

    static getInstance() {

        if (!ChatManager.instance) {

            ChatManager.instance =
                new ChatManager();

        }

        return ChatManager.instance;

    }

    private constructor() {}



    // private listenSocket(){
    //     this.socketManager.subscribe("new_message", this.handleChatMessage);
    //     this.socketManager.subscribe("history", this.handleHistory);
    //     this.socketManager.subscribe("totalUser", this.handleTotalUser);
    //     this.socketManager.subscribe("typing", this.handleTyping);
    //     this.socketManager.subscribe("stop_typing", this.handleStopTyping);
    //     this.socketManager.subscribe("delete_chat", this.handleDeleteChat);
    //     this.socketManager.subscribe("chatCreation", this.handleChatCreation);
    // }

    start() {
        if (this.started) return;
        this.started = true;

        socketManager.subscribe(
            "new_message",
            this.handleChatMessage
        );

        socketManager.subscribe(
            "history",
            this.handleHistory
        );

        socketManager.subscribe(
            "totalUser",
            this.handleTotalUser
        )

        socketManager.subscribe(
            "typing",
            this.handleTyping
        );

        socketManager.subscribe(
            "stop_typing",
            this.handleStopTyping
        );

        socketManager.subscribe(
            "delete_chat",
            this.handleDeleteChat
        );

        socketManager.subscribe(
            "chatCreation",
            this.handleChatCreation
        );

        this.joinAllChats();

    }

    stop() {
        if (!this.started) return;
        this.started = false;

        socketManager.unsubscribe(
            "new_message",
            this.handleChatMessage
        );

        socketManager.unsubscribe(
            "history",
            this.handleHistory
        );

        socketManager.unsubscribe(
            "totalUser",
            this.handleTotalUser
        );

        socketManager.unsubscribe(
            "typing",
            this.handleTyping
        );

        socketManager.unsubscribe(
            "stop_typing",
            this.handleStopTyping
        );

        socketManager.unsubscribe(
            "delete_chat",
            this.handleDeleteChat
        );

        socketManager.unsubscribe(
            "chatCreation",
            this.handleChatCreation
        );

    }

    private joinAllChats(){
        const conversationIds = useChatStore.getState().sideConversationOrder
    
        conversationIds.forEach((id)=>{
            const payload = {
                type: "join_conversation",
                conversationId : id,
            }
            socketManager.send(payload);
        })
    }

    sendMessage(payload:any){
        socketManager.send(payload);
    }


    private handleChatMessage(data:any){
        const store = useChatStore.getState();
        const current = store.messageByConversation[data.message.conversationId] || []
        
        const exists = current?.some((msg)=> (msg.clientID === data.clientID))
        console.log("exist:---------", exists);
        if(exists){
            console.log("replace---")
            store.replaceInstantMessage(data.message.conversationId, data.message, data.clientID)
        }
        else{
            const cached = store.messageByConversation[data.message.conversationId];
            if(cached){
                console.log("add into new---")
                store.addMessage(data.message.conversationId, data.message)
            }
        }
    
        store.updateCurrentChatToTop(data.message.conversationId)
        store.updateConversationPreview(data.message.conversationId, data.message.text, data.message.createdAt);
    
        const conversationId = store.selectedConversation || 0;
    
        console.log("event-ConversId", conversationId);
        console.log("data-ConversId", data.message.conversationId);
    
        if(data.message.conversationId !== conversationId){
            store.incrementCount(data.message.conversationId);
        }
    }

    private handleHistory(data:any){
        useChatStore.getState().setMessages(data.conversationId, data.message);
    }

    private handleTotalUser(data:any){
        useChatStore.getState().setJoinedUser(data.message.conversationId, data.message);
    }

    private handleTyping(data:any){
        useChatStore.getState().setTyping(data.message.conversationId, data.message.userId, data.message.isTyping);
    }

    private handleStopTyping(data:any){
        useChatStore.getState().setTyping(data.message.conversationId, data.message.userId, data.message.isTyping)
    }

    private handleDeleteChat(data:any){
        const store = useChatStore.getState();
        console.log("delete_chat Event---)")
        console.log("delete_chat Event---)*******")
        console.log("delete_chat Event---))))))))")
        const cached = store.messageByConversation[data.message.conversationId];
        if(cached){
        store.addMessage(data.message.conversationId, data.message);
        }
        console.log("User---id:) ", data.message.sender.id);
        const defaultData = store.sidebarDefaultConversation[data.message.conversationId];
        console.log("defULTdATA: ", defaultData);
        const filterFriends = defaultData?.member.filter((ids)=> ids.user.id !== data.message.sender.id);
        console.log("FliteredFriends: ", filterFriends);
        if(!filterFriends) return;
        const updatedFriends = {
            ...defaultData,
            member : filterFriends,
        }
        console.log("UpdatedFriends: ", updatedFriends);
        store.setSidebarDefaultConversation(data.message.conversationId, updatedFriends as any);
    }

    private handleChatCreation(data:any){
        const store = useChatStore.getState();
        const user = useStore.getState().user;
        const updateVal = {
            ...data.message.data,
            member : data.message.data.member.filter((ids:any)=> ids.userId !== user?.id) 
        }
        console.log("UpdateDAta: ", updateVal);
        store.setSidebarDefaultConversation(data.conversationId, updateVal)
        store.setSideConversationOrder([data.conversationId, ...store.sideConversationOrder])
        console.log("group-create-Event---");
    }
}


export const chatManager =
    ChatManager.getInstance();