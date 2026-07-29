import rough from "roughjs";
import { useSocket } from "../../../providers/SocketProvider";
import { RenderManager } from "./RenderManager";
import { CanvasStore } from "../store/CanvasStore";
import { ShapeRenderManager } from "./ShapeRenderManager";
import { InputManager } from "./InputManager";
import { ToolManager } from "../tools/ToolManager";
import { RectangleTool } from "../tools/RectangleTool";
import { CircleTool } from "../tools/CircleTool";
import { Tool, ToolType } from "../tools/Tool";
import { ArrowTool } from "../tools/ArrowTool";
import { LineTool } from "../tools/LineTool";
import { PencilTool } from "../tools/PencilTool";
import { TextTool } from "../tools/TextTool";
import { ShapeRender } from "../renderer/1ShapeRender";
import { Shape } from "../shapeFormat/Shape";
import { RectangleRenderer } from "../renderer/RectangleRenderer";
import { CircleRenderer } from "../renderer/CircleRenderer";
import { ArrowRenderer } from "../renderer/ArrowRenderer";
import { LineRenderer } from "../renderer/LineRenderer";
import { PencilRenderer } from "../renderer/PencilRenderer";
import { TextRenderer } from "../renderer/TextRenderer";
import { Registery } from "./Registery";
import { SelectionTool } from "../hitTest/SelectionTool";
import { HitTestManager } from "../hitTest/HitTestManager";



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


// export interface BaseShape{
//     id : string,
//     type : ShapeType,

//     fill : string,
//     stroke : string,

//     strokeWidth : number,
// }

export class CanvasEngine{
    // private pageShape : Record<number,Shape[]>;
    private currRoomId : number;
    private canvas : HTMLCanvasElement;
    private socket : WebSocket;
    private ctx : CanvasRenderingContext2D;
    // private rc : HTMLCanvasElement;
    private renderer : RenderManager;
    private shapeRender : ShapeRenderManager;
    private inputManager : InputManager;
    private toolManager : ToolManager;

    private store : CanvasStore;
    private registry : Registery;
    private hitTestManager : HitTestManager;
    private onToolChange : (tool:ToolType)=>void

    constructor(roomId:number, canvas:HTMLCanvasElement, socket:any, onToolChange : (e:ToolType)=>void){
        this.currRoomId = roomId;
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        // const socket = useSocket();
        if(!ctx) throw new Error("canvas not supported");
        this.ctx = ctx;
        this.socket = socket;
        console.log("inside Engine-------");
        // this.pointerEventHandler();
        // this.pageShape = {};
        this.onToolChange = onToolChange;

        // first initialize store where the shape is going to store
        this.store = new CanvasStore();
        // fetch all shapes and shapes[] and send to RenderManagaer and it send to ShapeRenderManager
        const allShapes = this.store.getAllShapes();

        console.log("Engine Store", this.store);

        // create instance of shapeRenderManager once;
        this.shapeRender = new ShapeRenderManager(ctx);

        // ---------------------Registry Instance:-----------
        const registry = new Map<ToolType, ShapeRender<Shape>>();
        registry.set("rectangle", new RectangleRenderer(ctx));
        registry.set("circle", new CircleRenderer(ctx));
        registry.set("arrow", new ArrowRenderer(ctx));
        registry.set("line", new LineRenderer(ctx));
        registry.set("pencil", new PencilRenderer(ctx));
        registry.set("text", new TextRenderer(ctx));

        this.registry = new Registery(registry);

        this.hitTestManager = new HitTestManager(this.store, this.registry);

        const tools = new Map<ToolType, Tool>();
        tools.set("rectangle", new RectangleTool(this.store));
        tools.set("circle", new CircleTool(this.store));
        tools.set("arrow", new ArrowTool(this.store));
        tools.set("line", new LineTool(this.store));
        tools.set("text", new TextTool(this.store, canvas, ctx));
        tools.set("pencil", new PencilTool(this.store));
        tools.set("select", new SelectionTool(this.hitTestManager, this.store));

        this.toolManager = new ToolManager(tools);

        this.inputManager = new InputManager(canvas, this.toolManager, this.onToolChange);

        console.log("inputManager created:---")
        
        // send whole CanvasStore instance bcz on every update or add Shape[] will change so direct 
        // whole shape access and and store RenderManager instance into listner()=>void then call that 
        // listner on every changes in Shape[] of CanvasStore
        this.renderer = new RenderManager(this.registry, this.ctx, this.canvas, this.store, this.shapeRender);
        
        this.resizeCanvas();
        console.log("Render Store", this.store);
        
        // this.renderer.start();

        window.addEventListener("resize", this.resizeCanvas);
        // this.rc = rough.canvas(canvas);

        ctx.restore();
    }

    // private pointerEventHandler(){
    //     this.canvas.onpointerdown(e:PointerEvent)
    // }

    setTool(shape : ToolType){
        this.toolManager.setCurrentTool(shape);
    }

    currentTool(){
        this.toolManager.getTool();
    }

    

    private resizeCanvas(){
        // this.canvas.width = this.canvas.clientWidth;
        // this.canvas.height = this.canvas.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;

        this.ctx.scale(dpr, dpr);
    }

    destroy(){
        this.renderer.destroy();
        this.inputManager.destroy();
        window.removeEventListener("resize", this.resizeCanvas);
    }
}