import { ShapeRenderManager } from "./ShapeRenderManager";




export class RenderManager{

    private ctx : CanvasRenderingContext2D;
    private canvas : HTMLCanvasElement;
    private render : ShapeRenderManager;
    private shape[] : Shape[];

    constructor(ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement){
        this.ctx = ctx;
        this.canvas = canvas;

        this.render = new ShapeRenderManager(this.ctx);

        this.canvas.addEventListener("pointerdown", o)
    }

    start(){

        for(const shp of this.shape){
            this.render.draw(shp);
        }
    }
}