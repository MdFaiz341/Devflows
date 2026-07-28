import { Circle } from "../shapeFormat/AllShapes";
import { ShapeRender } from "./1ShapeRender";





export class CircleRenderer implements ShapeRender<Circle>{

    constructor(
        private ctx : CanvasRenderingContext2D,
    ){}

    draw(shape: Circle): void {

        this.ctx.beginPath();

        const x = Math.min(shape.x, shape.x + shape.width);
        const y = Math.min(shape.y, shape.y + shape.height);
    
        const width =  Math.abs(shape.width);
        const height = Math.abs(shape.height);

        const centerX = x + width/2;
        const centerY = y + height/2;
        this.ctx.ellipse(centerX, centerY, width/2, height/2, 0, 0, Math.PI * 2)

        // this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI*2);

        this.ctx.strokeStyle = shape.stroke;

        this.ctx.lineWidth = shape.strokeWidth;
        // this.ctx.fillStyle = shape.fill;
        // this.ctx.fill();

        this.ctx.stroke();

        // this.ctx.restore();
    }

    hitTest(circle: Circle, x: number, y: number): boolean {
        // const centerX = circle.x + circle.width/2;
        const dx = x - circle.centerX;

        // const centerY = circle.y + circle.height/2;
        const dy = y - circle.centerY;

        const radiusX = circle.width/2;
        const radiusY = circle.height/2;

        return dx*dx + dy*dy <= radiusX * radiusY;
    }

    drawSelection(shape: Circle): void {
        
    }
}