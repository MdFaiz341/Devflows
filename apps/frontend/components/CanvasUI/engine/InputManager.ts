import { ToolManager } from "../tools/ToolManager";



export class InputManager {
    private toolManager : ToolManager;
    private canvas : HTMLCanvasElement;
    private clickDown = false;
    constructor(canvas:HTMLCanvasElement, toolManager:ToolManager) {
        this.canvas = canvas
        this.toolManager = toolManager;
        console.log("InputManager instance", this);
        this.attachListeners();
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
        console.log("InputManager: pointerMove");
        this.toolManager.pointerMove(e);
    }

    private handlePointerUp = (e : PointerEvent)=>{
        this.toolManager.pointerUp(e);
        this.clickDown = false;
        this.toolManager.setCurrentTool("select");
    }


    destroy(){
        console.log("Destroy InputManager", this);
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