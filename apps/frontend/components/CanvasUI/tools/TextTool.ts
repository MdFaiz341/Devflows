import { useCanvasStore } from "../../../Storage/useCanvasStore";
import { Text } from "../shapeFormat/AllShapes";
import { CanvasStore } from "../store/CanvasStore";
import { ToolType } from "./Tool";
import { ToolManager } from "./ToolManager";



export class TextTool{

    private startX = 0;
    private startY = 0;
    private prevX = 0;
    private prevY = 0;
    private activeTextArea : HTMLTextAreaElement | null = null;
    constructor(
        private store : CanvasStore,
        private canvas : HTMLCanvasElement,
        private ctx : CanvasRenderingContext2D,
        private onToolChange : (tool:ToolType)=>void,
    ){}
 
    pointerDown(e:PointerEvent){

        const stroke = useCanvasStore.getState().stroke;
        const strokeWidth = useCanvasStore.getState().strokeWidth;
        const textSize = useCanvasStore.getState().textSize;

        this.startX = Math.round(e.offsetX);
        this.startY = Math.round(e.offsetY);

        const textArea = document.createElement("textarea");

        textArea.style.position = "absolute";
        textArea.style.left = `${this.startX}px`;
        textArea.style.top = `${this.startY}px`;
        textArea.style.background = "transparent";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.color = stroke;
        textArea.style.fontSize = textSize;
        textArea.style.fontFamily = "Arial";
        textArea.style.resize = "none";
        textArea.style.overflow = "hidden";
        textArea.rows = 1;
        textArea.style.padding = "0";
        textArea.style.margin = "0";
        textArea.style.lineHeight = "24px";
        textArea.style.whiteSpace = "pre";
        textArea.style.caretColor = stroke;

        const resize = ()=>{
            const metrics = this.ctx.measureText(textArea.value || " ");
            textArea.style.width = `${Math.max(40, metrics.width + 8)}px`;
        }
        resize();

        this.canvas.parentElement?.appendChild(textArea);
        

        const save = (textArea:HTMLTextAreaElement, x:number, y:number)=>{
            if (!textArea.value.trim()) {
                textArea.remove();
                this.activeTextArea = null;
                return;
            }
            const preview : Text = {
                id : crypto.randomUUID(),
                type : "text",
                x : x,
                y : y,
                text : textArea.value,

                fontSize: parseInt(textSize),
                fontFamily: "Arial",
                fontWeight: "normal",       // "normal" | "bold";
                fontStyle:  "normal",       // "normal" | "italic"
                textAlign: "left",          // "left" | "center" | "right";
                color: stroke,

                stroke : stroke,
                fill : "transparent",
                strokeWidth : strokeWidth,
            }
            // this.store.addShape(preview);
            const currPage = this.store.getCurrentPage();

            this.store.addShape(currPage, preview, true);

            textArea.remove();
            this.activeTextArea = null;
            this.onToolChange("select");
        }

        if(this.activeTextArea){

            if(this.activeTextArea.value.trim()){
                save(this.activeTextArea, this.prevX, this.prevY);
            }
            else{
                this.activeTextArea.remove();
                this.activeTextArea = null;
            }
        }
        this.prevX = this.startX;
        this.prevY = this.startY;
        this.activeTextArea = textArea;
        textArea.focus();
        

        textArea.addEventListener("keydown", (e)=>{
            if(e.key === "Enter" && !e.shiftKey){
                e.preventDefault();
                save(textArea, this.startX, this.startY);
            }
            else if(e.key === "Escape" || e.key === "Delete") {
                textArea.remove();
                this.activeTextArea = null;
            }
        })

        textArea.addEventListener("input", ()=>{
            resize();
            textArea.style.height = "auto";
            textArea.style.height = `${textArea.scrollHeight}px`;
        });


    }

    pointerMove(e:PointerEvent){
        return;
    }
    pointerUp(e:PointerEvent){
        // const previewShape = this.store.getPreview();
        // if(!previewShape) return;

        // this.store.addShape(previewShape);

        // this.store.clearPreview();

        this.activeTextArea = null;
        return;
    }
}