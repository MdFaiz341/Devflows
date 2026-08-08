import { create } from "zustand"


type ContentType = "Youtube" | "Github" | "Website link" | "Tweeter"

export type ContentFormat = {
    createdAt : string,
    id : string,
    link : string,
    tags : string[],
    title : string,
    type : string,
    userId : string,
}

interface BrainType{

    content : Record<string, ContentFormat[]>
    setContent : (type:string, data:ContentFormat)=>void

    deleteContent : (id:string, type:string)=>void

    clearMemory : ()=>void
}

export const useBrainStore = create<BrainType>(
    (set) =>({
        content : {},

        
        setContent : (type, data)=>set((state)=>{
            const allContent = state.content[type] || [];
            console.log("brianStore---", allContent);
            const exist = allContent?.some((val)=>val.id === data.id);
            if(exist) return{};

            return{
                content:{
                    ...state.content,
                    [type] : [...allContent, data]
                }
            }
        }),

        deleteContent : (id, type)=>set((state)=>{
            const allcontent = state.content[type]
            if(!allcontent) return{};
            const remContent = allcontent.filter((val)=> val.id !== id)

            return{
                content:{
                    ...state.content,
                    [type] : [...remContent]
                }
            }

        }),

        clearMemory : ()=>set({
            content : {},
        })
    })
)