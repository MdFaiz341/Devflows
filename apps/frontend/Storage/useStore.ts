import {create} from "zustand"
import { persist } from "zustand/middleware"

type User = {
    id : number,
    firstname : string,
    lastname : string,
    email : string,
    image:string,
}


interface Appstate{
    theme : "dark" | "light",
    setTheme : (val : "dark" | "light")=>void,
    user : User | null,
    setUser: (user : User | null) => void,
    logout : ()=>void,
}

export const useStore = create<Appstate>()(
    persist(
        (set)=>({
            user:null,
            theme:"dark",

            setUser : (user)=>set({user}),
            setTheme : (val) => set({theme : val}),

            logout : ()=>{
                set({user : null})
            }
        }),
        {
            name : "auth",
            partialize:(state)=>({
                user : state.user,
                theme: state.theme
            })
        }
    )
)
