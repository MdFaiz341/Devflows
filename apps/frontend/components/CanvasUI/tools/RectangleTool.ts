import { Rectangle } from "../shapeFormat/AllShapes";
import { CanvasStore } from "../store/CanvasStore";



export class RectangleTool{
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
        // calculate current size
        const width = Math.abs(e.offsetX - this.startX);
        const height = Math.abs(e.offsetY - this.startY);

        // Create preview rectangle

        const preview : Rectangle = {
            id : "preview",

            type : "rectangle",
            x : this.startX,
            y : this.startY,

            width : width,
            height : height,

            stroke : "#000",
            fill : "transparent",
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