import { Line } from "../shapeFormat/AllShapes";
import { ShapeRender } from "./1ShapeRender";




export class LineRenderer implements ShapeRender<Line>{

    constructor(
        private ctx : CanvasRenderingContext2D,
    ){}

    draw(shape: Line): void {
        this.ctx.beginPath();

        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);

        this.ctx.strokeStyle = shape.stroke;
        this.ctx.lineWidth = shape.strokeWidth;

        this.ctx.stroke();
    }

    hitTest(line: Line, x: number, y: number): boolean {
        const tolerance = 5;

        const dx = line.endX - line.startX;
        const dy = line.endY - line.startY;

        const lengthSquared = dx * dx + dy * dy;

        const t = Math.max(0, Math.min(1, ((x - line.startX) * dx + (y - line.startY) * dy) / lengthSquared));

        const px = line.startX + t * dx;

        const py = line.startY + t * dy;

        const distance = Math.hypot(x - px, y - py);
        // const distance = Math.sqrt(
        //     (x - px) * (x - px) + 
        //     (y - py) * (y - py)
        // )

        return distance <= tolerance;
    }

    drawSelection(line: Line): void {
        this.ctx.save();

        this.ctx.strokeStyle = "#4A90E2"

        this.ctx.lineWidth = 2;

        this.ctx.setLineDash([5,5]);
        const width = line.endX - line.startX;
        const height = line.endY - line.startY;
        this.ctx.strokeRect(line.startX, line.startY, width, height);

        this.ctx.restore();
    }
}