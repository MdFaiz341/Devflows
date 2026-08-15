import {  } from "../../../lib/socket/CanvasSyncManager";
import { Shape } from "../shapeFormat/Shape";



type Page = {
    pageNo:number,
    shape : Shape[]
}

export type CanvasEvent = "shapeAdded" | "shapeUpdated" | "shapeDeleted" | "currPageHistory"

export class CanvasStore{

    private currentPage = 1;
    private pageWithShape = new Map<number, Shape[]>();
    private listeners = new Set<() => void>();
    private preview :Shape | null;
    private selectedShapeId : string | null = null;
    private eventListeners = new Map<CanvasEvent, Set<(payload:any)=>void>>();

    constructor(
        private currRoomId : number,
    ){
        this.pageWithShape.set(1, []);
        this.preview = null;
    }
    getCurrentPage(){
        return this.currentPage;
    }

    getRoomId(){
        return this.currRoomId;
    }

    setCurrentPage(page:number){
        this.currentPage = page;
        if(!this.pageWithShape.has(page)){

            this.emit(
                "currPageHistory",
                {
                    page,
                    roomId:this.currRoomId,
                }
            )
        }
        this.notify();
    }

    setPreview(shape:Shape){
        this.preview = shape;
        this.notify();
    }

    getPreview(){
        return this.preview;
    }

    clearPreview(){
        this.preview = null;
        this.notify();
    }

    selectShape(id:string | null){
        this.selectedShapeId = id;
        this.notify();
    }

    getSelectedShapeId(){
        return this.selectedShapeId;
    }

    moveShape(id:string, dx:number, dy:number){
        const allShapes = this.pageWithShape.get(this.currentPage);
        if(!allShapes) return;

        const shape = allShapes.find(s => s.id === id);
        if(!shape) return;

        switch (shape.type){
            case "rectangle":
                shape.x += dx;
                shape.y += dy;
                break;
            
            case "circle" :
                shape.centerX += dx;
                shape.centerY += dy;
                break;
            
            case "line":
                shape.startX += dx;
                shape.endX += dx;

                shape.startY += dy;
                shape.endY += dy;
                break;

            case "arrow":
                shape.startX += dx;
                shape.endX += dx;

                shape.startY += dy;
                shape.endY += dy;
                break;

            case "text":
                shape.x += dx;
                shape.y += dy;
                break;

            case "pencil":
                // shape.startX += dx;
                // shape.endX += dx;

                // shape.startY += dy;
                // shape.endY += dy;
                break;
            

        }
        this.notify();
    }

    subscribe(listener : ()=>void){
        this.listeners.add(listener);

        return ()=>{
            this.listeners.delete(listener);
        }
    }

    unsubscribe(listener: () => void) {
        this.listeners.delete(listener);
    }

    private notify(){
        for(const listener of this.listeners){
            listener();
        }
    }


    on(
        event: CanvasEvent,
        listener: (payload:any)=>void
    ) {

        if (!this.eventListeners.has(event)) {

            this.eventListeners.set(
                event,
                new Set()
            );

        }

        this.eventListeners
            .get(event)!
            .add(listener);

    }

    off(event: CanvasEvent, listener: (payload:any)=>void) {
        this.eventListeners.get(event)?.delete(listener);
    }

    private emit(event: CanvasEvent, payload: any) {
        this.eventListeners.get(event)?.forEach(listener => {
                listener(payload);
            });
    }

    addShape(page:number, shape:Shape, broadcast:boolean){
        if(!this.pageWithShape.has(page)){
            this.pageWithShape.set(page, []);
        }
        const allShapes = this.pageWithShape.get(page);
        const isExist = allShapes?.some((val)=>val.id === shape.id);
        if(isExist === false){
            allShapes?.push(shape);
        }
        this.notify();

        if(broadcast){
            this.emit(
                "shapeAdded", 
                {
                    roomId: this.currRoomId,
                    page,
                    shape,
                }
            )
        }
    }

    removeShape(page:number, shapeId:string, broadcast:boolean){
        if(broadcast){
            this.emit(
                "shapeDeleted",
                {
                    roomId : this.currRoomId,
                    page, 
                    shapeId,
                }
            )
        }
        else{
            const shapes = this.pageWithShape.get(page);

            if(!shapes) return;

            const index = shapes.findIndex(s => s.id === shapeId);
        
            if(index == -1) return;

            shapes.splice(index, 1);
            this.notify();
        }
    }

    updateShape(page:number, shape:Shape, broadcast:boolean){
        const shapes = this.pageWithShape.get(page);
        if(!shapes) return;

        const index = shapes.findIndex(s=>s.id === shape.id);
        if(index == -1) return;

        shapes[index] = shape;
        this.notify();

        if(broadcast){
            this.emit(
                "shapeUpdated",
                {
                    roomId:this.currRoomId,
                    page,
                    shape
                }
            );
        }
    }

    shapeHistory(shape:Shape[], page:number){
        this.pageWithShape.set(page, shape);
        this.notify();
    }

    getShape(id:string){
        const allShapes = this.pageWithShape.get(this.currentPage);
        if(!allShapes) return null;
        const val = allShapes.find(shape => shape.id === id);
        // return this.shape.find(shape =>shape.id === id);
    }

    getAllShapes(){
        const val = this.pageWithShape.get(this.currentPage);
        if(!val) return [];
        return [...val];
    }

}