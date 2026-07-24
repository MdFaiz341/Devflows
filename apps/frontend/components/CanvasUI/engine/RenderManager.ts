import { Shape } from "../shapeFormat/Shape";
import { CanvasStore } from "../store/CanvasStore";
import { ShapeRenderManager } from "./ShapeRenderManager";




export class RenderManager{

    private ctx : CanvasRenderingContext2D;
    private canvas : HTMLCanvasElement;
    private render : ShapeRenderManager;
    private store : CanvasStore;

    constructor(ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, store:CanvasStore){
        this.ctx = ctx;
        this.canvas = canvas;

        this.store = store;

        this.render = new ShapeRenderManager(this.ctx);



        // this.canvas.addEventListener("pointerdown", o)
    }

    start(){
        for(const val of this.shape){
            this.render.draw(val);
        }
    }
}