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
        this.points.push({
            x : e.offsetX,
            y : e.offsetY,
        })

        const preview : Pencil = {
            id : "preview",
            type : "pencil",
            points : [...this.points],
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
        this.points = [];
    }
}