import { Line } from "../shapeFormat/AllShapes";
import { CanvasStore } from "../store/CanvasStore";



export class LineTool{

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

        const preview : Line = {
            id : "preview",
            type : "line",

            startX : this.startX,
            startY : this.startY,

            endX : e.offsetX,
            endY : e.offsetY,

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
        });
        this.store.clearPreview();
    }
}