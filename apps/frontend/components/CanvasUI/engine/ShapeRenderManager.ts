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
        this.ctx.save();

        this.ctx.strokeStyle = shape.stroke;

        this.ctx.lineWidth = shape.strokeWidth;

        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

        this.ctx.restore();
    }

    private drawCircle(shape:Circle){
        this.ctx.save();

        this.ctx.beginPath();

        this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI*2);

        this.ctx.strokeStyle = shape.stroke;

        this.ctx.lineWidth = shape.strokeWidth;

        this.ctx.stroke();

        this.ctx.restore();
    }

    drawArrow(shape:Arrow){

    }

    drawLine(shape:Line){

    }

    drawText(shape:Text){

    }

}