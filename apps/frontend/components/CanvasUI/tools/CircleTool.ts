import { Circle } from "../shapeFormat/AllShapes";
import { CanvasStore } from "../store/CanvasStore";



export class CircleTool{

    private startX = 0;
    private startY = 0;

    constructor(
        private store : CanvasStore
    ){}

    pointerDown(e:PointerEvent){
        this.startX = e.offsetX;
        this.startY = e.offsetY;
    }

    pointerMove(e:PointerEvent){
        // calculate width, height
        const dx = e.offsetX - this.startX;
        const dy = e.offsetY - this.startY;

        const centerX = this.startX + dx/2;
        const centerY = this.startY + dy/2;

        // const radius = Math.sqrt(dx*dx + dy*dy);

        const preview : Circle = {
            id : "preview",
            type : "circle",
            x : this.startX,
            y : this.startY,
            // radius : radius,
            width : dx,
            height : dy,

            centerX : centerX,
            centerY : centerY,

            stroke : "white",
            fill : "yellow",
            strokeWidth : 2,
        }
        this.store.setPreview(preview);
    }

    pointerUp(e:PointerEvent){
        const previewShape = this.store.getPreview();
        if(!previewShape) return;

        this.store.addShape({
            ...previewShape,
            id : crypto.randomUUID()
        })

        this.store.clearPreview();
    }
}