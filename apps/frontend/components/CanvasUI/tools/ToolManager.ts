import { Tool } from "../engine/CanvasEngine";
import { CanvasStore } from "../store/CanvasStore";



export class ToolManager{

    private currentTool : Tool;
    private store : CanvasStore;
    constructor(store:CanvasStore){
        this.store = store;
    }

    pointerDown(e:PointerEvent){
        this.currentTool.pointerDown(e);
    }

    pointerMove(e:PointerEvent){
        this.currentTool.pointerMove(e);
    }

    pointerUp(e:PointerEvent){
        this.currentTool.pointerUp(e);
    }
}