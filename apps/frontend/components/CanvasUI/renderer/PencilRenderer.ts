



import { Pencil, Rectangle } from "../shapeFormat/AllShapes";
import { ShapeRender } from "./1ShapeRender";




export class PencilRenderer implements ShapeRender<Pencil>{

    constructor(
        private ctx : CanvasRenderingContext2D,
    ){}

    draw(shape: Pencil): void {
        const pts = shape.points;
        if(pts.length < 2 || !pts[0]) return;

        this.ctx.beginPath();

        this.ctx.moveTo(pts[0]!.x, pts[0]!.y);
        for (let i = 1; i < pts.length - 1; i++) {
            const midX = (pts[i]!.x + pts[i + 1]!.x) / 2;
            const midY = (pts[i]!.y + pts[i + 1]!.y) / 2;

            this.ctx.quadraticCurveTo(
                pts[i]!.x,
                pts[i]!.y,
                midX,
                midY
            );
        }

        this.ctx.strokeStyle = shape.stroke;
        this.ctx.lineWidth = shape.strokeWidth;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.ctx.stroke();
    }

    hitTest(pencil:Pencil, x: number, y: number): boolean {
        const tolerance = 5;

        for(let i=0; i<pencil.points.length-1;i++){
            const a = pencil.points[i];
            const b = pencil.points[i+1];

            // distance to segment
            // if(distanceToSegment(x,y,a,b) <= tolerance){
            //     return true;
            // }

        }

        return false;
    }

    drawSelection(shape: Pencil): void {
        
    }
}