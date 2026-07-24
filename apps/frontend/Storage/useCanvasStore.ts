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

    canvasOrder : number[],   // roomIds
    setCanvasOrder : (e : number[])=>void,

    canvasCard : Record<number, CanvasCardFormat>,
    setCanvasCard : (id :number, data:CanvasCardFormat)=>void,

    canvasRoomData : Record<number, CanvasData>,
    setCanvasRoomData : (roomId:number, data:any)=>void,
}

export const useCanvasStore = create<CanvasType>(
    (set)=>({
        currentRoomId : null,
        canvasOrder : [],
        canvasCard : {},
        canvasRoomData : {},

        setCanvasRoomData : (roomId, data)=>set((state)=>({
            canvasRoomData : {
                ...state.canvasRoomData,
                [roomId] : data
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