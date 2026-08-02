import { CanvasStore } from "../store/CanvasStore";




export class SyncManager{

    constructor(
        private store : CanvasStore,
        private socket : WebSocket,
    ){

        this.socketListner();
    }



    socketListner(){
        this.socket.addEventListener("message", ()=>{
            
        })
    }
}