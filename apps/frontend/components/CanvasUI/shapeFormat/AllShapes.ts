import { BaseShape } from "./BaseShape";





export interface Rectangle extends BaseShape{
    type : "rectangle",

    x : number,
    y : number,

    width : number,
    height : number,
}


export interface Circle extends BaseShape{
    type : "circle",

    x : number,
    y : number,

    // radius : number,
    width : number,
    height : number,
}

export interface Arrow extends BaseShape{
    type : "arrow",
    startX:number,
    startY:number,
    endX:number,
    endY:number,
    angle : number,
    headLength : number,
}

export interface Line extends BaseShape{
    type : "line",
    startX:number,
    startY:number,
    endX:number,
    endY:number,
}

export interface Text extends BaseShape{
    type : "text",

    x:number,
    y:number,
    text:string,
}