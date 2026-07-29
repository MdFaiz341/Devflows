import { Arrow } from "../shapeFormat/AllShapes";
import { ShapeRender } from "./1ShapeRender";




export class ArrowRenderer implements ShapeRender<Arrow>{

    constructor(
        private ctx : CanvasRenderingContext2D,
    ){}

    draw(shape: Arrow): void {
        // left Wing:
        const leftX = shape.endX - shape.headLength * Math.cos(shape.angle - Math.PI/6);
        const leftY = shape.endY - shape.headLength * Math.sin(shape.angle - Math.PI/6);

        // right Wing:
        const rightX = shape.endX - shape.headLength * Math.cos(shape.angle + Math.PI/6);
        const rightY = shape.endY - shape.headLength * Math.sin(shape.angle + Math.PI/6);

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

    hitTest(arrow: Arrow, x: number, y: number): boolean {
        const tolerance = 5;

        const dx = arrow.endX - arrow.startX;
        const dy = arrow.endY - arrow.startY;

        const lengthSquared = dx * dx + dy * dy;

        const t = Math.max(0, Math.min(1, ((x - arrow.startX) * dx + (y - arrow.startY) * dy) / lengthSquared));

        const px = arrow.startX + t * dx;

        const py = arrow.startY + t * dy;

        const distance = Math.hypot(x - px, y - py);

        return distance <= tolerance;
    }

    drawSelection(arrow: Arrow): void {
        this.ctx.save();

        this.ctx.strokeStyle = "#4A90E2"

        this.ctx.lineWidth = 2;

        this.ctx.setLineDash([5,5]);
        const width = arrow.endX - arrow.startX;
        const height = arrow.endY - arrow.startY;
        this.ctx.strokeRect(arrow.startX, arrow.startY, width, height);

        this.ctx.restore();
    }
}