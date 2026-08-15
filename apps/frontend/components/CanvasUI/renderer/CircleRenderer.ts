import { Circle } from "../shapeFormat/AllShapes";
import { ShapeRender } from "./1ShapeRender";





export class CircleRenderer implements ShapeRender<Circle>{

    constructor(
        private ctx : CanvasRenderingContext2D,
    ){}

    draw(shape: Circle): void {

        this.ctx.beginPath();

        this.ctx.ellipse(shape.centerX, shape.centerY, shape.width/2, shape.height/2, 0, 0, Math.PI * 2)

        this.ctx.strokeStyle = shape.stroke;

        this.ctx.lineWidth = shape.strokeWidth;
        this.ctx.fillStyle = shape.fill;
        this.ctx.fill();

        this.ctx.stroke();

    }

    hitTest(circle: Circle, x: number, y: number): boolean {
        const dx = x - circle.centerX;

        const dy = y - circle.centerY;

        const radiusX = circle.width/2;
        const radiusY = circle.height/2;

        return dx*dx + dy*dy <= radiusX * radiusY;
    }

    drawSelection(circle: Circle): void {
        this.ctx.save();

        this.ctx.strokeStyle = "#4A90E2"

        this.ctx.lineWidth = 2;

        this.ctx.setLineDash([5,5]);

        const left = circle.centerX - circle.width/2;

        const top = circle.centerY - circle.height/2;

        const sizeX = circle.width/2 * 2;
        const sizeY = circle.height/2 * 2;

        this.ctx.strokeRect(left, top, sizeX, sizeY);

        this.ctx.restore();
    }
}