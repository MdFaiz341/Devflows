import { useCanvasStore } from "../../Storage/useCanvasStore";
import { socketManager } from "./SocketManager";



export class NotificationManager{

    private started = false;
    constructor(){}


    start(){
        if(this.started) return;
        console.log("Notification Started------");
        this.started = true;

        socketManager.subscribe(
            "canvas_DeleteShape_notify",
            this.receiveCanvasDeleteShape
        )

        socketManager.subscribe(
            "canvasRoom_online",
            this.receiveUsersOnline
        )

        socketManager.subscribe(
            "delete_Shape",
            this.deletedShape
        )
    }
    // notification receive nahi ho raha hai
    stop(){
        if(!this.started) return;

        this.started = false;

        socketManager.unsubscribe(
            "canvas_DeleteShape_notify",
            this.receiveCanvasDeleteShape
        )

        socketManager.unsubscribe(
            "canvasRoom_online",
            this.receiveUsersOnline
        )

        socketManager.unsubscribe(
            "delete_Shape",
            this.deletedShape
        )
    }


    private receiveCanvasDeleteShape = (data:any)=>{
        console.log("Delete Data Notify---- ", data);
        const setNotificationBar = useCanvasStore.getState().setNotificationBar;

        setNotificationBar(data.message);
    }

    private receiveUsersOnline = (data:any)=>{
        console.log("User Online---- ", data);
        const setJoinedUser = useCanvasStore.getState().setJoinedUser;

        setJoinedUser(data.message.roomId, data.message.users);
    }

    private deletedShape = (data:any)=>{
        console.log("Sucess Delete Shape----", data);
        const setNotificationBar = useCanvasStore.getState().setNotificationBar

        setNotificationBar(data.message);
    }


}