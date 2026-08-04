import { Rectangle } from "../shapeFormat/AllShapes";
import { ShapeRender } from "./1ShapeRender";




export class RectangleRenderer implements ShapeRender<Rectangle>{

    constructor(
        private ctx : CanvasRenderingContext2D,
    ){}

    draw(shape: Rectangle): void {
        console.log("Draw--- ", shape);
        this.ctx.save();

        this.ctx.strokeStyle = shape.stroke;

        this.ctx.lineWidth = shape.strokeWidth;
        console.log(shape.fill);
        this.ctx.fillStyle = shape.fill;
        this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);

        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

        this.ctx.restore();
    }

    hitTest(rect:Rectangle, x: number, y: number): boolean {
        return  x >= rect.x &&
                x <= rect.x + rect.width &&
                y >= rect.y &&
                y <= rect.y + rect.height
    }

    drawSelection(rect: Rectangle): void {
        this.ctx.save();

        this.ctx.strokeStyle = "#4A90E2"

        this.ctx.lineWidth = 2;

        this.ctx.setLineDash([5,5]);

        this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        this.ctx.restore();
    }
}