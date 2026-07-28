import { Rectangle, Text } from "../shapeFormat/AllShapes";
import { ShapeRender } from "./1ShapeRender";




export class TextRenderer implements ShapeRender<Text>{

    constructor(
        private ctx : CanvasRenderingContext2D,
    ){}

    draw(shape: Text): void {
        this.ctx.textBaseline = "top"
        this.ctx.font = `${shape.fontWeight} ${shape.fontSize}px ${shape.fontFamily}`;
        console.log("Text Render me hai-----");
        this.ctx.fillStyle = shape.color;
        this.ctx.textAlign = shape.textAlign;
        this.ctx.fillText(
            shape.text,
            Math.round(shape.x),
            Math.round(shape.y)
        );
    }

    hitTest(text:Text, x: number, y: number): boolean {
        this.ctx.font = `${text.fontSize}px Arial`;

        const width = this.ctx.measureText(text.text).width;

        return (
            x >= text.x 
            && x <= text.x + width && 
            y <= text.y && 
            y >= text.y - text.fontSize
        );
    }

    drawSelection(shape: Text): void {
        
    }
}