import { Registery } from "../engine/Registery";
import { Arrow, Circle, Line, Pencil, Rectangle, Text } from "../shapeFormat/AllShapes";
import { Shape } from "../shapeFormat/Shape";
import { CanvasStore } from "../store/CanvasStore";


export class HitTestManager{


    constructor(
        private store : CanvasStore,
        // private ctx : CanvasRenderingContext2D,
        private registery : Registery,
    ){}

    findShape(x:number, y : number){
        console.log("Inside HitManager-----");
        const shapes = this.store.getAllShapes();
        for(let i=shapes.length-1; i>=0; i--){
            const shape = shapes[i];
            console.log("shape[i]-- ", shape);
            // if(!shape) return;
            const renderer = this.registery.get(shape!.type);
            console.log("render Hit------", renderer);
            const hit = renderer?.hitTest(shape, x, y);
            console.log("hit Boolean return back--", hit);
            if(hit){
                console.log("Hittt---");
                console.log("FOUND: ", shape);
                return shape;
            }
        }
        return null;
    }


    // Now there is no need of all These
    // private hit(shape:Shape, x:number, y:number){
    //     switch (shape.type){
    //         case "rectangle":
    //             return this.rectangleHit(shape, x, y);

    //         case "circle":
    //             return this.circleHit(shape, x, y);
            
    //         case "arrow" :
    //             return this.arrowHit(shape, x, y);

    //         case "line" :
    //             return this.lineHit(shape, x, y);

    //         case "text" :
    //             // return this.textHit(shape, x, y);
            
    //         case "pencil" :
    //             return this.pencilHit(shape, x, y);
    //     }
    // }

    private rectangleHit(rect:Rectangle, x:number, y:number){
        return  x >= rect.x &&
                x <= rect.x + rect.width &&
                y >= rect.y &&
                y <= rect.y + rect.height
    }

    private circleHit(circle:Circle, x:number, y:number){
        // const centerX = circle.x + circle.width/2;
        const dx = x - circle.centerX;

        // const centerY = circle.y + circle.height/2;
        const dy = y - circle.centerY;

        const radiusX = circle.width/2;
        const radiusY = circle.height/2;

        return dx*dx + dy*dy <= radiusX * radiusY;
    }

    private arrowHit(arrow:Arrow, x:number, y:number){
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

    private lineHit(line:Line, x:number, y:number){
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

    private pencilHit(pencil:Pencil, x:number, y:number){
        const tolerance = 5;

        // for(let i=0; i<pencil.points.length-1;i++){
        //     const a = pencil.points[i];
        //     const b = pencil.points[i+1];

        //     // distance to segment
        //     if(
        //         distanceToSegment(
        //             x,
        //             y,
        //             a,
        //             b
        //         ) <= tolerance
        //     ){

        //         return true;

        //     }

        // }

        // return false;
    }

    // private textHit(text:Text, x:number, y:number){
    //     this.ctx.font = `${text.fontSize}px Arial`;

    //     const width = this.ctx.measureText(text.text).width;

    //     return (
    //         x >= text.x 
    //         && x <= text.x + width && 
    //         y <= text.y && 
    //         y >= text.y - text.fontSize
    //     );
    // }
}