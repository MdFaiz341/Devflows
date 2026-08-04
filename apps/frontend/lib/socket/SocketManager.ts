
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