import { useCanvasStore } from "../../../Storage/useCanvasStore";
import { Pencil, Points } from "../shapeFormat/AllShapes";
import { CanvasStore } from "../store/CanvasStore";



export class PencilTool{

    private points : Points[] = [];
    constructor(
        private store : CanvasStore
    ){}

    pointerDown(e:PointerEvent){
        this.points = [];
        this.points.push({
            x : e.offsetX,
            y : e.offsetY,
        })
    }

    pointerMove(e:PointerEvent){
        const stroke = useCanvasStore.getState().stroke;
        const strokeWidth = useCanvasStore.getState().strokeWidth;
        this.points.push({
            x : e.offsetX,
            y : e.offsetY,
        })

        const preview : Pencil = {
            id : "preview",
            type : "pencil",
            points : [...this.points],
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
        this.points = [];
    }
}