import { Arrow, Circle, Line, Rectangle, Text } from "../shapeFormat/AllShapes";
import { Shape } from "../shapeFormat/Shape";



export class ShapeRenderManager{

    private ctx : CanvasRenderingContext2D;

    constructor(ctx:CanvasRenderingContext2D){
        this.ctx = ctx;
    }


    draw(shape:Shape){
        switch (shape.type) {
            case "rectangle":
                this.drawRectangle(shape);
                break;
        
            case "circle":
                this.drawCircle(shape);
                break;

            case "arrow":
                this.drawArrow(shape);
                break;

            case "line":
                this.drawLine(shape);
                break;

            case "text":
                this.drawText(shape);
                break;

            default:
                break;
        }
    }


    private drawRectangle(shape:Rectangle){

    }

    private drawCircle(shape:Circle){

    }

    drawArrow(shape:Arrow){

    }

    drawLine(shape:Line){

    }

    drawText(shape:Text){

    }

}