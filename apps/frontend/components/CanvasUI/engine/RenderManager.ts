import { Shape } from "../shapeFormat/Shape";
import { CanvasStore } from "../store/CanvasStore";
import { ShapeRenderManager } from "./ShapeRenderManager";




export class RenderManager{

    private ctx : CanvasRenderingContext2D;
    private canvas : HTMLCanvasElement;
    private shapeRender : ShapeRenderManager;
    private store : CanvasStore;
    private frameRequest  = false;
    private unsubscribe? : ()=>void;

    constructor(ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, store:CanvasStore, shapeRender:ShapeRenderManager){
        this.ctx = ctx;
        this.canvas = canvas;

        this.store = store;

        
        // this.shapeRender = new ShapeRenderManager(this.ctx);
        // this.render = render;

        this.shapeRender = shapeRender;
    
        this.unsubscribe = this.store.subscribe(()=>{
            this.scheduleRender();
        })


        // this.canvas.addEventListener("pointerdown", o)
    }

    private scheduleRender(){
        if(this.frameRequest) return;

        this.frameRequest = true;

        requestAnimationFrame(()=>{

            this.frameRequest = false;
            this.render();
        })
    }

    private render(){

        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        const shapes = this.store.getAllShapes();
        for(const val of shapes){
            this.shapeRender.draw(val);
        }
    }

    destroy(){
        if(this.unsubscribe){
            this.unsubscribe();
        }
    }
}