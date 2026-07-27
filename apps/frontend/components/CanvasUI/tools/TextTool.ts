import { Text } from "../shapeFormat/AllShapes";
import { CanvasStore } from "../store/CanvasStore";



export class TextTool{

    private startX = 0;
    private startY = 0;
    constructor(
        private store : CanvasStore
    ){}

    pointerDown(e:PointerEvent){
        this.startX = e.offsetX;
        this.startY = e.offsetY;

        const textArea = document.createElement("textarea");

        textArea.style.position = "absolute";
        textArea.style.left = `${e.offsetX}`;
        textArea.style.top = `${e.offsetY}`;
        // textArea.style.background = "blue";
        
        document.body.appendChild(textArea);
        textArea.focus();

        textArea.addEventListener("blur", ()=>{
            const preview : Text = {
                id : crypto.randomUUID(),
                type : "text",
                x : this.startX,
                y : this.startY,
                text : textArea.value,

                fontSize: 24,
                fontFamily: "Arial",
                fontWeight: "normal",       // "normal" | "bold";
                fontStyle:  "normal",       // "normal" | "italic"
                textAlign: "left",          // "left" | "center" | "right";
                color: "white",

                stroke : "white",
                fill : "yellow",
                strokeWidth : 2,
            }

            console.log("Inseide TextArea Listener---");
            this.store.addShape(preview);

            // textArea.remove();
        })
    }

    pointerMove(e:PointerEvent){

    }
    pointerUp(e:PointerEvent){

    }
}