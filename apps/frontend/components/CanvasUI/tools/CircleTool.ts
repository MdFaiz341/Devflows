import { useCanvasStore } from "../../../Storage/useCanvasStore";
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
        const stroke = useCanvasStore.getState().stroke;
        const background = useCanvasStore.getState().background;
        const strokeWidth = useCanvasStore.getState().strokeWidth;

        // calculate width, height
        const dx = e.offsetX - this.startX;
        const dy = e.offsetY - this.startY;

        const x = Math.min(this.startX, this.startX + dx);
        const y = Math.min(this.startY, this.startY + dy);
    
        const width =  Math.abs(dx);
        const height = Math.abs(dy);

        const centerX = x + width/2;
        const centerY = y + height/2;

        const preview : Circle = {
            id : "preview",
            type : "circle",
            x : this.startX,
            y : this.startY,
            width : width,
            height : height,

            centerX : centerX,
            centerY : centerY,

            stroke : stroke,
            fill : background,
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