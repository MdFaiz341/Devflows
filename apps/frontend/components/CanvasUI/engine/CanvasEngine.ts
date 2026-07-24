import rough from "roughjs";
import { useSocket } from "../../../providers/SocketProvider";
import { RenderManager } from "./RenderManager";
import { CanvasStore } from "../store/CanvasStore";

export type Tool = 
    "rectangle" | "circle" | "line" | "arrow" | "pencil" | "text";


// export type Shape = {
//     type : "rectangle",
//     x:number,
//     y:number,
//     width :number,
//     height:number,
// } | {
//     type : "circle",
//     centerX:number,
//     centerY:number,
//     radius : number
// } | {
//     type : "line",
//     startX:number,
//     startY:number,
//     endX:number,
//     endY:number,
// } | {
//     type : "arrow",
//     startX:number,
//     startY:number,
//     endX:number,
//     endY:number,
//     angle:number
// } | {
//     type : "text",
//     x:number,
//     y:number,
//     text:string,
// }


export interface BaseShape{
    id : string,
    type : ShapeType,

    fill : string,
    stroke : string,

    strokeWidth : number,
}

export class CanvasEngine{
    // private pageShape : Record<number,Shape[]>;
    private currRoomId : number;
    private canvas : HTMLCanvasElement;
    private socket : WebSocket;
    private ctx : CanvasRenderingContext2D;
    // private rc : HTMLCanvasElement;
    private renderer : RenderManager;

    private store : CanvasStore;

    constructor(roomId:number, canvas:HTMLCanvasElement, socket:any){
        this.currRoomId = roomId;
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        // const socket = useSocket();
        if(!ctx) throw new Error("canvas not supported");
        this.ctx = ctx;
        this.socket = socket;

        // this.pointerEventHandler();
        // this.pageShape = {};


        // first initialize store where the shape is going to store
        this.store = new CanvasStore();
        // fetch all shapes and shapes[] and send to RenderManagaer and it send to ShapeRenderManager
        const allShapes = this.store.getAllShapes();
        
        // send whole CanvasStore instance bcz on every update or add Shape[] will change so direct 
        // whole shape access and and store RenderManager instance into listner()=>void then call that 
        // listner on every changes in Shape[] of CanvasStore
        this.renderer = new RenderManager(this.ctx, this.canvas, this.store);
        
        this.resizeCanvas();
        
        this.renderer.start();

        window.addEventListener("resize", this.resizeCanvas);
        // this.rc = rough.canvas(canvas);

        ctx.restore();
    }

    // private pointerEventHandler(){
    //     this.canvas.onpointerdown(e:PointerEvent)
    // }



    private resizeCanvas(){
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    destroy(){
        this.renderer.stop();
        window.removeEventListener("resize", this.resizeCanvas);
    }
}