


import api from "../../API/Interceptor";
import { useChatStore } from "../../Storage/useChatStore";
import { useStore } from "../../Storage/useStore";
import { chatManager } from "./ChatManager";


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

    this.socket.onopen = async ()=>{
      console.log("WS-CONNECTED");
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      await this.fetchConversations();
                  
      chatManager.start();
    }

    this.socket.onmessage = this.eventHandler;

    this.socket.onclose = ()=>{
      console.log("WS CLOSED");
      this.isConnecting = false;
      this.reconnect();
      chatManager.stop();
    }

    this.socket.onerror = (err)=>{
      console.log("Error: ", err);
      chatManager.stop();
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

    const listeners = this.handlers.get(data.type)
    listeners?.forEach( listen =>{
      listen(data);
    })
  }



  private async fetchConversations(){
        try{
          const response = await api.get("/conversations");

          const user = useStore.getState().user;
          const chatStore = useChatStore.getState();

          chatStore.setBackendConversation(response.data.conversation)

          const val = response.data.conversation.map((v:any)=> v.id)
          chatStore.setSideConversationOrder(val);

          response.data.conversation.forEach((v:any)=> {
              const friendDetails = v.members.filter((users:any) => users.userId !== user?.id);
              const data = {
                  conversationId : v.id,
                  createdAt : v.createdAt,
                  image : v.image || null,
                  member : friendDetails,
                  lastMessage : v.messages.length > 0 ? v.messages[0].text.includes("joined") ? "" : v.messages[0].text : "",
                  type : v.type,
                  name : v.name || null,
                  updatedAt : v.updatedAt,
              } 
              chatStore.setSidebarDefaultConversation(v.id, data);

              //set default unread Messages:
              const currUser = v.members.find((admin:any)=>admin.userId === user?.id)

              if(currUser.unreadCount > 0){
                  chatStore.setUnreadMessage(currUser.conversationId, currUser.unreadCount);
              }
          })

      }
      catch(e:any){
          console.log(e);
      }
    }

  send(payload:any){
    if(!this.socket || this.socket.readyState !== WebSocket.OPEN){
      return;
    }

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