
// let socket: WebSocket | null = null;

import { useCanvasStore } from "../../Storage/useCanvasStore";
import { useChatStore } from "../../Storage/useChatStore";
import { useStore } from "../../Storage/useStore";


export class SocketManager {
  private static instance: SocketManager;
  private socket : WebSocket | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private shouldReconnect = true;
  private MAX_RECONNECT_ATTEMPTS = 10;
  private reconnectTimeOut : NodeJS.Timeout | null = null;

  private handlers = new Map<string, Set<(data:any)=>void>>();


  static getInstance(){
    if(!SocketManager.instance){
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(){

    this.shouldReconnect = true;

    if(this.socket && this.socket.readyState === WebSocket.OPEN 
        || this.socket?.readyState === WebSocket.CONNECTING){
      return;
    }

    if(this.isConnecting) return;
    
    this.isConnecting = true;

    this.socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_SERVER_URL}`);

    this.attachEventListner();
  }

  private attachEventListner(){
    if(!this.socket) return;

    this.socket.onopen = ()=>{
      console.log("WS-CONNECTED");
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      // this.joinAllChats();
    }

    this.socket.onmessage = this.eventHandler;

    this.socket.onclose = ()=>{
      console.log("WS CLOSED");
      this.isConnecting = false;
      this.reconnect();
    }

    this.socket.onerror = (err)=>{
      console.log("Error: ", err);
    }
  }

  subscribe(type:string, handler:(data:any)=>void){
    if(!this.handlers.has(type)){
      this.handlers.set(type, new Set());
    }

    this.handlers.get(type)?.add(handler);

    // return ()=>{
    //   this.handlers.get(type)?.delete(handler);
    // }
  }

  unsubscribe(type:string, handler:(data:any)=>void){
    this.handlers.get(type)?.delete(handler)
  }

  private eventHandler = (event : MessageEvent)=>{
    const data = JSON.parse(event.data);
    console.log("Socket-Receive-- ", data);

    const listeners = this.handlers.get(data.type)
    listeners?.forEach( listen =>{
      listen(data);
    })
    // switch(data.type){

    //   case "new_message":
    //     this.handleChatMessage(data);
    //     break;

    //   case "history":
    //     this.handleHistory(data);
    //     break;

    //   case "totalUser":
    //     this.handleTotalUser(data);
    //     break;

    //   case "typing":
    //     this.handleTyping(data);
    //     break;

    //   case "stop_typing":
    //     this.handleStopTyping(data);
    //     break;

    //   case "delete_chat":
    //     this.handleDeleteChat(data);
    //     break;

    //   case "chatCreation":
    //     this.handleChatCreation(data);
    //     break;
      
    //   case "canvas_History":
    //     this.canvasHistory(data);
    //     break;

    //   case "canvasRoom_online":
    //     this.canvasOnlineUser(data);
    //     break;

    //   case "canvas_msg":
    //     this.saveShape(data);
    //     break;
      
    // }
  }

  private saveShape(data:any){
    const setCanvasRoomData = useCanvasStore.getState().setCanvasRoomData;
    setCanvasRoomData(data.roomId, data.shape, data.pageNo);
  }

  private canvasHistory(data:any){
    // const setCanvasRoomData = useCanvasStore.getState().setCanvasRoomData;
    // setCanvasRoomData(data.message.roomId, data.message.historyData);
  }

  private canvasOnlineUser(data:any){
    // kuch draw karo canvas pe so shape dikhega then online user set kro 
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

  private joinAllChats(){
    const conversationIds = useChatStore.getState().sideConversationOrder
    if(!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    
    // socketEventListner(this.socket);
    // console.log("Event-Listners---")

    conversationIds.forEach((id)=>{
      const payload = {
        type: "join_conversation",
        conversationId : id,
      }
      this.send(payload);
    })
  }

  send(payload:any){
    if(!this.socket || this.socket.readyState !== WebSocket.OPEN){
      return;
    }
    console.log("SocketManager Send()-- ", payload);
    this.socket.send(JSON.stringify({
      ...payload,
    }))
  }

  disconnect(){
    if(this.reconnectTimeOut){
      clearTimeout(this.reconnectTimeOut);
    }
    this.socket?.close();
    this.socket = null;
  }

  private reconnect(){
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      return;
    }

    this.reconnectAttempts++;

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(
      `Reconnecting in ${delay}ms`
    );

    this.reconnectTimeOut = setTimeout(() => {
      this.connect();
    }, delay);
  }

  getSocket(){
    return this.socket;
  }
}


export const socketManager = SocketManager.getInstance();