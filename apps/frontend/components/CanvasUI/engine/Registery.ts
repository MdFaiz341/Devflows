import { ShapeRender } from "../renderer/1ShapeRender";
import { ToolType } from "../tools/Tool";




export class Registery{

    constructor(
        private renderer : Map<ToolType, ShapeRender<any>>,
    ){}


    get(type : ToolType){
        return this.renderer.get(type);
    }
}