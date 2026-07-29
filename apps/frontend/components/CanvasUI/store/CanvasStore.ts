import { Shape } from "../shapeFormat/Shape";




export class CanvasStore{

    private shape : Shape[];
    private listeners = new Set<() => void>();
    private preview :Shape | null;
    private selectedShapeId : string | null = null;

    constructor(){
        this.shape = [];
        this.preview = null;
        console.log("CanvasStore created", this);
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
        this.selectedShapeId = id;
        this.notify();
    }

    getSelectedShapeId(){
        return this.selectedShapeId;
    }

    moveShape(id:string, dx:number, dy:number){
        const shape = this.shape.find(s => s.id === id);
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
        this.shape.push(shape);
        this.notify()
    }

    removeShape(id:string){
        this.shape = this.shape.filter(shape => shape.id !== id)
        this.notify();
    }

    updateShape(shape:Shape){
        const index = this.shape.findIndex(shapes =>shapes.id === shape.id);
        if(index === -1) return;
        this.shape[index] = shape;
        this.notify();
    }

    // for move the tool
    getShape(id:string){
        return this.shape.find(shape =>shape.id === id);
    }

    getAllShapes(){
        return [...this.shape];
    }

}