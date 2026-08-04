import { Shape } from "../shapeFormat/Shape";
import { CanvasStore } from "../store/CanvasStore";
import { Registery } from "./Registery";
import { ShapeRenderManager } from "./ShapeRenderManager";




export class RenderManager{

    private ctx : CanvasRenderingContext2D;
    private canvas : HTMLCanvasElement;
    private store : CanvasStore;
    private frameRequest  = false;
    private unsubscribe? : ()=>void;
    private registery : Registery;

    constructor(registery:Registery, ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement, store:CanvasStore){
        this.ctx = ctx;
        this.canvas = canvas;

        this.store = store;

        console.log("RenderManager store", this.store);
        // this.shapeRender = new ShapeRenderManager(this.ctx);
        // this.render = render;

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
        console.log("GetAllShapes---- ", shapes);
        const selected = this.store.getSelectedShapeId();
        for(const val of shapes){
            console.log("Type--- ", val.type);
            const renderer = this.registery.get(val.type);
            console.log("Renderer--- ", renderer);
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