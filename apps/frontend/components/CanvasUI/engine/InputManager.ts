import { ToolManager } from "../tools/ToolManager";



export class InputManager {
    private toolManager : ToolManager;
    private canvas : HTMLCanvasElement;
    constructor(canvas:HTMLCanvasElement, toolManager:ToolManager) {
        this.canvas = canvas
        this.toolManager = toolManager;

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
    }

    private handlePointerMove = (e : PointerEvent)=>{
        this.toolManager.pointerMove(e);
    }

    private handlePointerUp = (e : PointerEvent)=>{
        this.toolManager.pointerUp(e);
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