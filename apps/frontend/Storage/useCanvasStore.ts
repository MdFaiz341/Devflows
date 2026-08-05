import { create } from "zustand";





export interface CanvasCardFormat{
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

type UserDataFormat = {
    image : string,
    name : string,
    email : string,
    role : "MEMBER" | "ADMIN"
}

interface JoinedUserType{
    roomId : number,
    totalUser : number,
    users : UserDataFormat[]
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
    setCanvasOrder : (e : number)=>void,

    canvasCard : Record<number, CanvasCardFormat>,
    setCanvasCard : (id :number, data:CanvasCardFormat)=>void,

    canvasRoomData : Record<number, any[]>,    // pageNo, shapes
    setCanvasRoomData : (roomId:number, data:any, pageNo:number)=>void,

    joinedUser : JoinedUserType | null,
    setJoinedUser : (roomId:number, totalUser:number, userData:UserDataFormat)=>void,
    notificationBar : string | null,
    setNotificationBar : (e:string)=>void,
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
        joinedUser : null,
        notificationBar : null,

        stroke : "white",
        strokeWidth : 2,
        background : "transparent",
        textSize : "22px",

        setNotificationBar : (message)=>set({
            notificationBar : message
        }),

        setJoinedUser : (roomId, totalUser, userData)=>set((state)=>{

            const existUsers = state.joinedUser?.users || [];
            return{
                joinedUser : {
                    roomId,
                    totalUser,
                    users : [...existUsers, userData]
                }
            }
        }),

        setTextSize : (val)=>set({textSize:val}),

        setBackground : (val)=>set({background:val}),
        setStrokeWidth : (val)=> set({strokeWidth:val}),
        setStroke : (val)=> set({stroke:val}),

        setCanvasRoomData : (roomId, data, pageNo)=>set((state)=>{
            const savedShape = state.canvasRoomData[pageNo] || [];

            return{
                canvasRoomData:{
                    ...state.canvasRoomData,
                    [pageNo] : [...savedShape, data],
                }
            }
        }),

        setCanvasCard : (id, data)=>set((state)=>{
    
            const val = state.canvasCard[id];
            if(val) return {};

            return{
                canvasCard:{
                    ...state.canvasCard,
                    [id] : data,
                }
            }
        }),
        setCanvasOrder : (ids:number)=>set((state)=>{
            if(state.canvasOrder.includes(ids)){
                return {};
            }

            return{
                canvasOrder : [
                    ...state.canvasOrder,
                    ids
                ]
            }
        }),

        setCurrentRoomId : (id)=>set({currentRoomId : id})
    })
)