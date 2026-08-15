import { Registery } from "../engine/Registery";
import { CanvasStore } from "../store/CanvasStore";


export class HitTestManager{


    constructor(
        private store : CanvasStore,
        private registery : Registery,
    ){}

    findShape(x:number, y : number) {
        const shapes = this.store.getAllShapes();
        for(let i=shapes.length-1; i>=0; i--){
            const shape = shapes[i];
            if(!shape) return;
            const renderer = this.registery.get(shape!.type);
            const hit = renderer?.hitTest(shape, x, y);
            if(hit){
                return shape;
            }
        }
        return null;
    }
}