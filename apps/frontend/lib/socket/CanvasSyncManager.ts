
import { CanvasStore } from "../../components/CanvasUI/store/CanvasStore";
import { socketManager } from "./SocketManager";




export class CanvasSyncManager{

    private started = false;

    constructor(
        private store : CanvasStore
    ){}

    start() {
        if (this.started) return;
        this.started = true;

        // Store Events:   Store -> Server
        this.store.on(
            "shapeAdded",
            this.handleNewShape
        )

        this.store.on(
            "shapeUpdated",
            this.handleUpdateShape,
        )

        this.store.on(
            "shapeDeleted",
            this.handleDeleteShape
        )

        // Sockets Events    Server -> Store
        socketManager.subscribe(
            "new_Shape",
            this.receiveNewShape
        );

        socketManager.subscribe(
            "shape_History",
            this.receiveHistory
        );

        socketManager.subscribe(
            "update_Shape",
            this.receiveUpdateShape
        )

        // socketManager.subscribe(
        //     "pointer_move",
        //     this.handlePointerMoving
        // );

        socketManager.subscribe(
            "delete_Shape",
            this.receiceDeleteShape
        );

    }

    stop() {
        if (!this.started) return;
        this.started = false;

        this.store.off(
            "shapeAdded",
            this.handleNewShape
        );

        this.store.off(
            "shapeUpdated",
            this.handleUpdateShape

        );

        this.store.off(
            "shapeDeleted",
            this.handleDeleteShape
        );

        socketManager.unsubscribe(
            "new_Shape",
            this.receiveNewShape
        );

        socketManager.unsubscribe(
            "shape_History",
            this.receiveHistory
        );

        socketManager.unsubscribe(
            "update_Shape",
            this.receiveUpdateShape
        );

        // socketManager.unsubscribe(
        //     "pointer_move",
        //     this.handlePointerMoving
        // );

        socketManager.unsubscribe(
            "delete_Shape",
            this.receiceDeleteShape
        );
    }

    // Client send:-
    private  handleNewShape = (payload:any)=>{
        console.log("handleNewShape:--- ", payload);
        socketManager.send({
            type: "new_Shape",
            roomId: payload.roomId,
            page: payload.page,
            shape: payload.shape,
        });
    }

    private handleDeleteShape = (payload:any)=>{
        socketManager.send({
            type: "delete_Shape",
            roomId: payload.roomId,
            page: payload.page,
            shapeId: payload.shapeId,
        });
    }

    private handleUpdateShape = (payload:any)=>{
        socketManager.send({
            type: "update_Shape",
            roomId: payload.roomId,
            page: payload.page,
            shape: payload.shape,
        });
    }

    joinCnvasRoom(roomId:number){
        const payload = {
            type : "join_canvasRoom",
            roomId
        }
        socketManager.send(payload);
    }

    leaveRoom(roomId:number){
        const payload = {
            type : "leave_canvas",
            roomId
        }
        socketManager.send(payload);
    }

    // server broadcast, now receiving:
    private receiveNewShape = (data:any)=>{
        this.store
        .addShape(
            data.page,
            data.shape,
            false
        );
    }
    private receiceDeleteShape = (data:any)=>{
        this.store
        .removeShape(
            data.page,
            data.id,
            false
        );
    }

    private receiveUpdateShape = (data:any)=>{
        this.store
        .updateShape(
            data.page,
            data.shape,
            false
        );
    }

    private receiveHistory = (data:any)=>{
        console.log("history--- ", data);
        // this.store
        // .setPageShapes(
        //     data.roomId,
        //     data.pages
        // );
    }
}
