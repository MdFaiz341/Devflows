import { create } from "zustand"


type ContentType = "youtube" | "github" | "website" | "twitter" | "All" | "linkedin"

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
    setContent : (contents : Record<ContentType, ContentFormat[]>)=>void

    deleteContent : (id:string)=>void

    clearMemory : ()=>void
}

export const useBrainStore = create<BrainType>(
    (set) =>({
        content : {},

        
        setContent : (data)=>set({content : data}),

        deleteContent : (id)=>set((state)=>{
            const updatedContent = {...state.content};

            Object.keys(updatedContent).forEach((type)=>{
                const contents = updatedContent[type];
                if(!contents) return;

                updatedContent[type] = contents.filter((content)=> content.id !== id);
            })

            return{
                content : updatedContent
            }
        }),

        clearMemory : ()=>set({
            content : {},
        })
    })
)