import { useCanvasStore } from "../../../Storage/useCanvasStore";
import { Shape } from "../shapeFormat/Shape";
import { GetAllShapes } from "./GetAllShapes";



type Page = {
    pageNo:number,
    shape : Shape[]
}

export class CanvasStore{

    // private shape : Shape[];
    private currentPage = 1;
    private pageWithShape = new Map<number, Shape[]>();
    private listeners = new Set<() => void>();
    private preview :Shape | null;
    private selectedShapeId : string | null = null;
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

    async setCurrentPage(page:number){
        this.currentPage = page;
        if(!this.pageWithShape.has(page)){
            // this.pageWithShape.set(page, []);

            // fet data from backend is shape exir return shape[] else [];
            const shapes = await GetAllShapes(this.currRoomId, this.currentPage);
            this.pageWithShape.set(this.currentPage, shapes);
        }
        else{
            const canvasRoomData = useCanvasStore.getState().canvasRoomData[this.currentPage] || [];
            this.pageWithShape.set(this.currentPage, canvasRoomData)
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
                shape.y += dx;
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
    

    addShape(shape:Shape){

        if(!this.pageWithShape.has(this.currentPage)){
            this.pageWithShape.set(this.currentPage, []);
        }
        const allShapes = this.pageWithShape.get(this.currentPage);
        allShapes?.push(shape);

        // this.shape.push(shape);
        this.notify()
    }

    removeShape(){
        console.log("current Shape id: ", this.selectedShapeId);
        const allShapes = this.pageWithShape.get(this.currentPage);
        const filterShapes = allShapes?.filter(shape => shape.id !== this.selectedShapeId);
        if(filterShapes) this.pageWithShape.set(this.currentPage, filterShapes);
        else this.pageWithShape.set(this.currentPage, [])

        // this.shape = this.shape.filter(shape => shape.id !== id)
        this.notify();
    }

    // updateShape(shape:Shape){
    //     const index = this.shape.findIndex(shapes =>shapes.id === shape.id);
    //     if(index === -1) return;
    //     this.shape[index] = shape;
    //     this.notify();
    // }

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