import { CursorManager } from "../cursor/CursorManager";
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
        private shapeSetting : (e:boolean)=>void,
        private registery : Registery,
        private cursor : CursorManager,
    ){}

    pointerDown(e:PointerEvent){
        const shape = this.testManager.findShape(e.offsetX, e.offsetY);
        
        if(!shape){
            this.store.selectShape(null);
            return;
        }

        this.store.selectShape(null);

        this.store.selectShape(shape.id);


        this.shapeSetting(true);
        this.dragging = true;
        this.lastX = e.offsetX;
        this.lastY = e.offsetY;

        const renderer = this.registery.get(shape.type);
        renderer?.drawSelection(shape);

        this.cursor.set("move")
    }

    pointerMove(e:PointerEvent){
        if(!this.dragging) return;

        const dx = e.offsetX - this.lastX;
        const dy = e.offsetY - this.lastY;

        this.lastX =  e.offsetX;
        this.lastY = e.offsetY;

        const id = this.store.getSelectedShapeId();
        if(!id) return;
        this.cursor.set("move");
        this.store.moveShape(id, dx, dy);

        this.shapeSetting(false);
    }

    pointerUp(e:PointerEvent){
        this.dragging = false;
        // this.store.selectShape(null);
        // this.cursor.set("default");
    }
}