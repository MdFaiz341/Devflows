import { CursorManager } from "../cursor/CursorManager";
import { ToolType } from "../tools/Tool";
import { ToolManager } from "../tools/ToolManager";



export class InputManager {
    private toolManager : ToolManager;
    private canvas : HTMLCanvasElement;
    private clickDown = false;
    private onToolChange : (e:ToolType)=>void
    private cursor : CursorManager;

    constructor(cursor:CursorManager, canvas:HTMLCanvasElement, toolManager:ToolManager, onToolChange : (e:ToolType)=>void) {
        this.canvas = canvas
        this.toolManager = toolManager;
        this.attachListeners();
        this.onToolChange = onToolChange;
        this.cursor = cursor;
    }


    private attachListeners(){
        this.canvas.addEventListener(
            "pointerdown",
            this.handlePointerDown
        );

        this.canvas.addEventListener(
            "pointermove",
            this.handlePointerMove
        )

        this.canvas.addEventListener(
            "pointerup",
            this.handlePointerUp
        )  
    }


    private handlePointerDown = (e : PointerEvent)=>{
        this.toolManager.pointerDown(e);
        this.clickDown = true;

    }

    private handlePointerMove = (e : PointerEvent)=>{
        if(this.toolManager.currentTool === "text") this.clickDown = false;
        if(!this.clickDown) return;
        this.toolManager.pointerMove(e);

        if(this.toolManager.currentTool === "text") this.cursor.set("text");
        else if(this.toolManager.currentTool !== "select") this.cursor.set("crosshair")
        // else this.cursor.set("crosshair");
    }

    private handlePointerUp = (e : PointerEvent)=>{
        this.toolManager.pointerUp(e);
        this.clickDown = false;
        this.toolManager.setCurrentTool("select");
        this.onToolChange("select");
        this.cursor.set("default")
    }


    destroy(){
        this.canvas.removeEventListener(
            "pointerdown",
            this.handlePointerDown
        );

        this.canvas.removeEventListener(
            "pointermove",
            this.handlePointerMove
        )

        this.canvas.removeEventListener(
            "pointerup",
            this.handlePointerUp
        ) 
    }
}