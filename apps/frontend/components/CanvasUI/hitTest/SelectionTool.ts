import { CanvasStore } from "../store/CanvasStore";
import { HitTestManager } from "./HitTestManager";



export class SelectionTool{


    constructor(
        private hitTest : HitTestManager,
        private store : CanvasStore,
    ){}

    pointerDown(e:PointerEvent){
        const shape = this.hitTest.findShape(e.offsetX, e.offsetY);
        if(!shape){
            this.store.selectShape(null);
            return;
        }

        this.store.selectShape(shape.id);
    }
}