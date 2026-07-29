import { Shape } from "../shapeFormat/Shape";
import { CanvasStore } from "../store/CanvasStore";
import { Registery } from "./Registery";
import { ShapeRenderManager } from "./ShapeRenderManager";




export class RenderManager{

    private ctx : CanvasRenderingContext2D;
    private canvas : HTMLCanvasElement;
    private shapeRender : ShapeRenderManager;
    private store : CanvasStore;
    private frameRequest  = false;
    private unsubscribe? : ()=>void;
    private registery : Registery;

    constructor(registery:Registery, ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, store:CanvasStore, shapeRender:ShapeRenderManager){
        this.ctx = ctx;
        this.canvas = canvas;

        this.store = store;

        console.log("RenderManager store", this.store);
        // this.shapeRender = new ShapeRenderManager(this.ctx);
        // this.render = render;

        this.shapeRender = shapeRender;

        this.registery = registery;
    
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

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const shapes = this.store.getAllShapes();

        const selected = this.store.getSelectedShapeId();
        for(const val of shapes){
            const renderer = this.registery.get(val.type);

            renderer?.draw(val)

            if(val.id === selected){
                console.log("yes selected:---");
                renderer?.drawSelection(val);
            }
        }

        const previewShape = this.store.getPreview();
        if(!previewShape) return;
        const renderer = this.registery.get(previewShape?.type);

        renderer?.draw(previewShape)
        

    }

    destroy(){
        if(this.unsubscribe){
            this.unsubscribe();
        }
    }
}