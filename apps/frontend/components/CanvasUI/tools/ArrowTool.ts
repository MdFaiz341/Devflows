import { Arrow } from "../shapeFormat/AllShapes";
import { CanvasStore } from "../store/CanvasStore";



export class ArrowTool{

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
        // find direction :-
        const angle = Math.atan2(e.offsetY-this.startY, e.offsetX-this.startY);

        const preview : Arrow = {
            id : "preview",
            type : "arrow",
            startX : this.startX,
            startY : this.startY,
            endX : e.offsetX,
            endY : e.offsetY,
            angle : angle,
            
            headLength : 15,
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