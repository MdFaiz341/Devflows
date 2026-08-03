
import { CanvasStore } from "../../components/CanvasUI/store/CanvasStore";
import { socketManager } from "./SocketManager";




export class CanvasSyncManager{

    private started = false;

    private constructor(
        private store : CanvasStore
    ){}

    start() {
        if (this.started) return;
        this.started = true;

        socketManager.subscribe(
            "new_Shape",
            this.handleNewShape
        );

        socketManager.subscribe(
            "shape_History",
            this.handleHistory
        );

        socketManager.subscribe(
            "update_Shape",
            this.handleUpdateShape
        )

        // socketManager.subscribe(
        //     "pointer_move",
        //     this.handlePointerMoving
        // );

        socketManager.subscribe(
            "delete_Shape",
            this.handleDeleteShape
        );

    }

    stop() {
        if (!this.started) return;
        this.started = false;

        socketManager.unsubscribe(
            "new_Shape",
            this.handleNewShape
        );

        socketManager.unsubscribe(
            "shape_History",
            this.handleHistory
        );

        socketManager.unsubscribe(
            "update_Shape",
            this.handleUpdateShape
        );

        // socketManager.unsubscribe(
        //     "pointer_move",
        //     this.handlePointerMoving
        // );

        socketManager.unsubscribe(
            "delete_Shape",
            this.handleDeleteShape
        );
    }

    // Client send:-
    sendShape(payload:any){
        socketManager.send(payload);
    }

    joinCnvasRoom(roomId:number){
        const payload = {
            type : "join_canvasRoom",
            roomId
        }
        socketManager.send(payload);
    }

    deleteShape(roomId:number, pageNo:number, id:string){
        const payload = {
            type : "delete_Shape",
            roomId,
            pageNo,
            id
        }
        socketManager.send(payload);
    }

    updateShape(roomId:number, shape:any, pageNo:number){
        const payload = {
            type : "update_Shape",
            roomId,
            pageNo,
            shape
        }
        socketManager.send(payload);
    }

    // server broadcast, now receiving:
    private handleNewShape = (data:any)=>{
        this.store
        .addShape(
            data.page,
            data.shape,
            false
        );
    }
    private handleDeleteShape = (data:any)=>{
        this.store
        .removeShape(
            data.page,
            data.id,
            false
        );
    }

    private handleUpdateShape = (data:any)=>{
        this.store
        .updateShape(
            data.page,
            data.shape,
            false
        );
    }

    private handleHistory = (data:any)=>{
        this.store
        // .setPageShapes(
        //     data.roomId,
        //     data.pages
        // );
    }
}
