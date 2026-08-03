
import { useCanvasStore } from "../../../Storage/useCanvasStore";
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
        const stroke = useCanvasStore.getState().stroke;
        const background = useCanvasStore.getState().background;
        const strokeWidth = useCanvasStore.getState().strokeWidth;

        // calculate current size
        const width = e.offsetX - this.startX;
        const height = e.offsetY - this.startY;

        console.log(width, height);
        console.log("Rectangle store", this.store);
        // Create preview rectangle
        const preview : Rectangle = {
            id : "preview",

            type : "rectangle",
            x : this.startX,
            y : this.startY,

            width : width,
            height : height,

            stroke : stroke,
            fill : background,
            strokeWidth : strokeWidth,
        }

        this.store.setPreview(preview);
    }

    pointerUp(e:PointerEvent){
        const previewShape = this.store.getPreview();
        if(!previewShape) return;
        const currentPage = this.store.getCurrentPage();

        const finalShape = {
            ...previewShape,
            id : crypto.randomUUID(),
        }

        this.store.addShape(currentPage, finalShape, true);

        this.store.clearPreview();
    }
}