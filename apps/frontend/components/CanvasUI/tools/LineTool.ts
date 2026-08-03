import { useCanvasStore } from "../../../Storage/useCanvasStore";
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
        const stroke = useCanvasStore.getState().stroke;
        const strokeWidth = useCanvasStore.getState().strokeWidth;

        const preview : Line = {
            id : "preview",
            type : "line",

            startX : this.startX,
            startY : this.startY,

            endX : e.offsetX,
            endY : e.offsetY,

            stroke : stroke,
            fill : "transparent",
            strokeWidth : strokeWidth,
        }

        this.store.setPreview(preview);
    }

    pointerUp(e:PointerEvent){
        const previewShape = this.store.getPreview();
        if(!previewShape) return;

        const currPage = this.store.getCurrentPage();
        const finalShape = {
            ...previewShape,
            id : crypto.randomUUID(),
        }
        this.store.addShape(currPage, finalShape, true);
        
        this.store.clearPreview();
    }
}