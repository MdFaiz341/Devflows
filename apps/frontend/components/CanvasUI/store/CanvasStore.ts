import { Shape } from "../shapeFormat/Shape";




export class CanvasStore{

    private shape : Shape[];
    private listeners = new Set<() => void>();
    private preview :Shape | null;

    constructor(){
        this.shape = [];
        this.preview = null;
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