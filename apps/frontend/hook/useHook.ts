import { useState } from "react"



export const useHook = ()=>{

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);


    return{open, setOpen, active, setActive, loading, setLoading};
}