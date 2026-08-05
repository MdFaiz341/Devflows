import { useStore } from "../../../Storage/useStore";


type Shapes = 
    "rectangle" | "circle" | "text" | "line" | "arrow" | "pencil"


export interface BaseShape{
    id : string;
    type : Shapes,

    fill : string
    stroke : string;

    strokeWidth : number
}
