import { BaseShape } from "./BaseShape";





export interface Rectangle extends BaseShape{
    type : "rectangle",

    x : number,
    y : number,

    width : number,
    height : number,
}


interface Circle extends BaseShape{
    type : "circle",

    x : number,
    y : number,

    radius : number,
}

interface Arrow extends BaseShape{
    type : "arrow",

    x:number,
    y:number,
}