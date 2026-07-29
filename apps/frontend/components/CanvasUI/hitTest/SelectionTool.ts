import { Registery } from "../engine/Registery";
import { CanvasStore } from "../store/CanvasStore";
import { HitTestManager } from "./HitTestManager";



export class SelectionTool{
    
    private dragging = false;
    private lastX = 0;
    private lastY = 0;

    constructor(
        private testManager : HitTestManager,
        private store : CanvasStore,
    ){}

    pointerDown(e:PointerEvent){
        console.log("Seletion Tool----");
        const shape = this.testManager.findShape(e.offsetX, e.offsetY);
        console.log("PointDown Select---- ", shape);
        if(!shape){
            this.store.selectShape(null);
            return;
        }

        this.store.selectShape(shape.id);

        this.dragging = true;
        this.lastX = e.offsetX;
        this.lastY = e.offsetY;
    }

    pointerMove(e:PointerEvent){
        if(!this.dragging) return;

        const dx = e.offsetX - this.lastX;
        const dy = e.offsetY - this.lastY;

        this.lastX =  e.offsetX;
        this.lastY = e.offsetY;

        const id = this.store.getSelectedShapeId();
        if(!id) return;

        this.store.moveShape(id, dx, dy);
    }

    pointerUp(e:PointerEvent){
        this.dragging = false;
        this.store.selectShape(null);
    }
}