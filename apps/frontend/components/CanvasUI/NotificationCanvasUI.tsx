import { useEffect } from "react";
import { useCanvasStore } from "../../Storage/useCanvasStore"
import { toast } from "sonner";
import { Button } from "@repo/ui/button";
import { Radio } from "lucide-react";
import { useHook } from "../../hook/useHook";




export const NotificationCanvasUI = ()=>{
    const joinedUser = useCanvasStore((state)=>state.joinedUser);
    const {active, setActive} = useHook();

    return(
        <div className="absolute top-3 left-3">
            <Button
                type="button"
                text={`${joinedUser?.totalUser} Live`}
                design="outline"
                onClick={()=>setActive(true)}
                className={`flex gap-2 items-center rounded-lg px-2 py-1 ${!active ? "block" : "hidden"}`}
                icon={<Radio size={15}/>}
                iconFirst={true}
            />

            <div className={`rounded-lg h-[30%] p-2 overflow-auto ${active ? "block" : "hidden"}`}>
                {
                    joinedUser?.users.map((data, index)=>{
                        return(
                            <div key={index}>
                                <div className="flex gap-2 items-center">
                                    <img src={data?.image} className="w-5 h-5 rounded-full"/>
                                    <div className="flex flex-col justify-between">
                                        <span>{data?.name}</span>
                                        <span>{data?.email}</span>
                                    </div>
                                    <span>
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