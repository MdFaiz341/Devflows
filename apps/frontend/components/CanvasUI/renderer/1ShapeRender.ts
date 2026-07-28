import { Shape } from "../shapeFormat/Shape";




export interface ShapeRender<T extends Shape>{

    draw(shape:T) : void,

    hitTest(shape:T, x:number, y:number):boolean,

    drawSelection(shape:T):void

}