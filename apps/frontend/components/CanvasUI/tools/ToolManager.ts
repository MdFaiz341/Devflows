
import { CanvasStore } from "../store/CanvasStore";
import { Tool, ToolType } from "./Tool";



export class ToolManager{

    private currentTool : ToolType = "select";
    private allTools : Map<ToolType, Tool>;
    constructor(allTools: Map<ToolType, Tool>){
        this.allTools = allTools;
    }

    setCurrentTool(val : ToolType){
        this.currentTool = val;
        console.log("currntTool----", this.currentTool);
    }

    private getTool(){
        return this.allTools.get(this.currentTool);
    }

    pointerDown(e:PointerEvent){
        const tool = this.getTool();
        console.log("ToolManager tool:--- ", tool);
        if(!tool) return;
        tool.pointerDown(e);
    }

    pointerMove(e:PointerEvent){
        const tool = this.getTool();
        console.log("ToolManager tool:--- ", tool);
        if(!tool) return;
        tool.pointerMove(e);
    }

    pointerUp(e:PointerEvent){
        const tool = this.getTool();
        console.log("ToolManager tool:--- ", tool);
        if(!tool) return;
        tool.pointerUp(e);
    }
}