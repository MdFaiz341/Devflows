import rough from "roughjs";
import { useSocket } from "../../../providers/SocketProvider";
import { RenderManager } from "./RenderManager";

export type ShapeType = 
    "rectangle" | "circle" | "line" | "arrow" | "pencil" | "text"


export interface BaseShape{
    id : string,
    type : ShapeType,

    fill : string,
    stroke : string,

    strokeWidth : number,
}

export class CanvasEngine{
    private allShapes : BaseShape[];
    private currRoomId : number;
    private canvas : HTMLCanvasElement;
    private socket : WebSocket;
    private ctx : CanvasRenderingContext2D;
    // private rc : HTMLCanvasElement;
    private renderer : RenderManager;

    constructor(roomId:number, canvas:HTMLCanvasElement, socket:){
        this.currRoomId = roomId;
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        // const socket = useSocket();
        if(!ctx) throw new Error("canvas not supported");
        this.ctx = ctx;
        this.socket = socket;

        this.renderer = new RenderManager(this.ctx, this.canvas);
        
        this.resizeCanvas();
        
        this.renderer.start();

        window.addEventListener("resize", this.resizeCanvas);
        // this.rc = rough.canvas(canvas);

        ctx.restore();
    }

    private resizeCanvas(){
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    destroy(){
        this.renderer.stop();
        window.removeEventListener("resize", this.resizeCanvas);
    }
}