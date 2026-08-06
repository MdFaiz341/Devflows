import {  } from "../../../lib/socket/CanvasSyncManager";
import { useCanvasStore } from "../../../Storage/useCanvasStore";
import { Shape } from "../shapeFormat/Shape";
import { GetAllShapes } from "./GetAllShapes";



type Page = {
    pageNo:number,
    shape : Shape[]
}

export type CanvasEvent = "shapeAdded" | "shapeUpdated" | "shapeDeleted" | "currPageHistory"

export class CanvasStore{

    // private shape : Shape[];
    private currentPage = 1;
    private pageWithShape = new Map<number, Shape[]>();
    private listeners = new Set<() => void>();
    private preview :Shape | null;
    private selectedShapeId : string | null = null;
    private eventListeners = new Map<CanvasEvent, Set<(payload:any)=>void>>();

    constructor(
        private currRoomId : number,
    ){
        // this.shape = [];
        this.pageWithShape.set(1, []);
        this.preview = null;
        console.log("CanvasStore created", this);
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
            console.log("SetCurrPage hitt--- ");
            // this.pageWithShape.set(page, []);
            // fet data from backend is shape exir return shape[] else [];
            // const shapes = await GetAllShapes(this.currRoomId, this.currentPage);
            // this.pageWithShape.set(this.currentPage, shapes);
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
        console.log("Preview Updated", shape);
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
        console.log("set Shape ID:--- ", id);
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
        console.log("Subscribed")

        return ()=>{
            this.listeners.delete(listener);
        }
    }

    unsubscribe(listener: () => void) {
        this.listeners.delete(listener);
    }

    private notify(){
        // console.log("notify size: ", this.listeners.size)
        for(const listener of this.listeners){
            listener();
        }
    }

    // addShape(shape:Shape){

    //     if(!this.pageWithShape.has(this.currentPage)){
    //         this.pageWithShape.set(this.currentPage, []);
    //     }
    //     const allShapes = this.pageWithShape.get(this.currentPage);
    //     allShapes?.push(shape);

    //     // this.shape.push(shape);
    //     this.notify()
    // }


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
            console.log("Not Exit, so Add Shape----");
            allShapes?.push(shape);
        }
        this.notify();

        if(broadcast){
            console.log("Broadcast---");
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
        // const shapes = this.pageWithShape.get(page);
        // if(!shapes) return;
        // const index = shapes.findIndex(s => s.id === shapeId);
        // if(index == -1) return;

        // shapes.splice(index, 1);
        // this.notify();

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
        // if(!this.pageWithShape.has(page)){
        //     this.pageWithShape.set(page, []);
        // }
        // this.pageWithShape.set
        // // allShapes = shapes
        // const allShapes = shape;
        console.log("Shapes-- ", shape);
        this.pageWithShape.set(page, shape);
        this.notify();
    }

    // for move the tool
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
        // return [...this.shape];
    }

}