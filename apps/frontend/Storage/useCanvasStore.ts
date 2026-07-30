import { create } from "zustand";





interface CanvasCardFormat{
    createdAt : string,
    roomId : number,
    image : string,
    name : string,
    members : [
        {
            joinedAt : string,
            role : "ADMIN" | "MEMBER",
            userId : string,
            user : {
                firstname : string,
                email : string,
                image : string,
            }
        },
    ]
}

interface CanvasData{
    data:any,
}

interface CanvasType{
    currentRoomId : number | null,
    setCurrentRoomId : (e : number)=>void,

    stroke : string,
    setStroke : (e:string)=>void

    strokeWidth : number,
    setStrokeWidth : (e:number)=>void,

    textSize : string,
    setTextSize : (e:string)=>void,

    background : string,
    setBackground : (e:string)=>void,

    canvasOrder : number[],   // roomIds
    setCanvasOrder : (e : number[])=>void,

    canvasCard : Record<number, CanvasCardFormat>,
    setCanvasCard : (id :number, data:CanvasCardFormat)=>void,

    canvasRoomData : Record<number, CanvasData>,    // pageNo, shapes
    setCanvasRoomData : (roomId:number, data:any)=>void,
}

// stroke : "white",
// fill : "yellow",
// strokeWidth : 2,

export const useCanvasStore = create<CanvasType>(
    (set)=>({
        currentRoomId : null,
        canvasOrder : [],
        canvasCard : {},
        canvasRoomData : {},

        stroke : "white",
        strokeWidth : 2,
        background : "transparent",
        textSize : "22px",


        setTextSize : (val)=>set({textSize:val}),

        setBackground : (val)=>set({background:val}),
        setStrokeWidth : (val)=> set({strokeWidth:val}),
        setStroke : (val)=> set({stroke:val}),

        setCanvasRoomData : (pageNo, data)=>set((state)=>({
            canvasRoomData : {
                ...state.canvasRoomData,
                [pageNo] : data,
            }
        })),

        setCanvasCard : (id, data)=>set((state)=>({
            canvasCard:{
                ...state.canvasCard,
                [id] : data,
            }
        })),
        setCanvasOrder : (ids)=>set({canvasOrder : ids}),
        setCurrentRoomId : (id)=>set({currentRoomId : id})
    })
)