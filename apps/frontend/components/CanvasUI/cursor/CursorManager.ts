



export class CursorManager{

    constructor(
        private canvas : HTMLCanvasElement,
    ){}

    set(cursor:string){
        this.canvas.style.cursor = cursor;
    }
}