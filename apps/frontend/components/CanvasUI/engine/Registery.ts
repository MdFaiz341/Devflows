import { ShapeRender } from "../renderer/1ShapeRender";
import { Shape } from "../shapeFormat/Shape";
import { ToolType } from "../tools/Tool";




export class Registery{

    constructor(
        private renderer : Map<ToolType, ShapeRender<Shape>>,
    ){}


    get(type : ToolType){
        return this.renderer.get(type);
    }
}