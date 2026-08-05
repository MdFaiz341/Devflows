import { useEffect, useState } from "react";
import { useCanvasStore } from "../../Storage/useCanvasStore"
import { toast } from "sonner";
import { Button } from "@repo/ui/button";
import { Radio } from "lucide-react";
import { useHook } from "../../hook/useHook";




export const NotificationCanvasUI = ()=>{
    const joinedUser = useCanvasStore((state)=>state.joinedUser);
    const setJoinedUser = useCanvasStore((state)=>state.setJoinedUser);
    const {active, setActive, open, setOpen} = useHook();

    // const [joinedUser, setJoinedUser] = useState<JoinedUserType>();

    console.log("JoinedUser---- ", joinedUser);
    if(!joinedUser) return;



    return(
        <div className="absolute top-3 left-3 z-50 rounded-lg">
            <Button
                type="button"
                text={`${joinedUser?.totalUser} Live`}
                design="outline"
                onClick={()=>setActive(!active)}
                className={`flex gap-2 items-center text-sm rounded-lg px-2 py-1 `}
                icon={<Radio size={15}/>}
                iconFirst={true}
            />

            <div className={`rounded-lg bg-gray-700 mt-3 h-[30%] p-2 overflow-auto ${active ? "block" : "hidden"}`}>
                {
                    joinedUser?.users.map((data, index)=>{
                        return(
                            <div key={index} className="rounded-lg py-3 px-2 hover:bg-gray-800">
                                <div className="flex gap-2 items-center text-gray-300">
                                    <img src={data?.image} className="w-5 h-5 rounded-full"/>
                                    <div className="flex flex-col justify-between text-xs w-28">
                                        <span className="truncate font-semibold">{data?.name}</span>
                                        <span className="truncate">{data?.email} </span>
                                    </div>
                                    <div className="h-5 w-[2px] ml-3 bg-gray-500"></div>
                                    <span className="text-[12px]">
                                        {data?.role} 
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}