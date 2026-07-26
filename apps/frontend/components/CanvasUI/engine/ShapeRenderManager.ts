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
        // this.ctx.save();
        this.ctx.beginPath();
        
        const x = Math.min(shape.x, shape.x + shape.width);
        const y = Math.min(shape.y, shape.y + shape.height);
    
        const width =  Math.abs(shape.width);
        const height = Math.abs(shape.height);

        this.ctx.ellipse(x+width/2, y+height/2, width/2, height/2, 0, 0, Math.PI * 2)

        // this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI*2);

        this.ctx.strokeStyle = shape.stroke;

        this.ctx.lineWidth = shape.strokeWidth;
        // this.ctx.fillStyle = shape.fill;
        // this.ctx.fill();

        this.ctx.stroke();

        // this.ctx.restore();
    }

    drawArrow(shape:Arrow){
        // left Wing:
        const leftX = shape.endX - shape.headLength * Math.cos(shape.angle - Math.PI/10);
        const leftY = shape.endY - shape.headLength * Math.sin(shape.angle - Math.PI/10);

        // right Wing:
        const rightX = shape.endX - shape.headLength * Math.cos(shape.angle + Math.PI/10);
        const rightY = shape.endY - shape.headLength * Math.sin(shape.angle + Math.PI/10);

        this.ctx.lineCap = "round"
        this.ctx.lineJoin = "round"

        // draw line:
        this.ctx.beginPath()

        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);

        this.ctx.strokeStyle = shape.stroke;
        this.ctx.lineWidth = shape.strokeWidth;
        this.ctx.stroke();

        // draw wing:
        this.ctx.beginPath();

        this.ctx.moveTo(shape.endX, shape.endY);
        this.ctx.lineTo(leftX, leftY);

        this.ctx.moveTo(shape.endX, shape.endY);
        this.ctx.lineTo(rightX, rightY);

        this.ctx.stroke();
    }

    private drawLine(shape:Line){
        this.ctx.beginPath();

        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);

        this.ctx.strokeStyle = shape.stroke;
        this.ctx.lineWidth = shape.strokeWidth;

        this.ctx.stroke();
    }

    drawText(shape:Text){

    }

}