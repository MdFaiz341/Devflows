
"use client"

import { Circle, MousePointer, MoveUpRight, PencilLine, Slash, Square, TextCursor, UserRoundPlus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useHook } from "../../hook/useHook"
import { InviteGenerator } from "./InviteGenerator"
import { Button } from "@repo/ui/button"
import { LeaveCanvasUI } from "./LeaveCanvasUI"
import { CanvasEngine } from "./engine/CanvasEngine"
import { Tool, ToolType } from "./tools/Tool"
import { ShapeSetting } from "./ShapeSetting"
import { CanvasNotificationUI } from "./CanvasNotificationUI"
import { CanvasGroupMember } from "./CanvasGroupMember"

const Buttons = [
    {
        id : 1,
        shape : "circle",
        btn : <Circle size={15}/>
    },
    {
        id : 2,
        shape : "rectangle",
        btn : <Square size={15}/>
    },
    {   
        id : 3,
        shape : "arrow",
        btn : <MoveUpRight size={17}/>,
    },
    {
        id : 4,
        shape : "line",
        btn : <Slash size={15}/>,
    },
    {
        id : 5,
        shape : "pencil",
        btn : <PencilLine size={15}/>
    },{
        id : 6,
        shape : "text",
        btn : <TextCursor size={15}/>
    },{
        id : 7,
        shape : "select",
        btn : <MousePointer size={15}/>
    }
]


export const Canvas = ({roomId, adminId}:{
    roomId:number,
    adminId:string,
})=>{

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [showFriend, setShowFriend] = useState(false);
    const [showLeave, setShowLeave] = useState(false);
    const {open, setOpen, active, setActive} = useHook();
    const [currTool, setCurrTool] = useState<ToolType>("select");
    const engineRef = useRef<CanvasEngine | null>(null);
    const [page, setPage] = useState(1);


    useEffect(()=>{
        if(!canvasRef.current) return;
        const canvas = canvasRef.current;
        engineRef.current = new CanvasEngine(roomId, canvas, (tool)=>setCurrTool(tool), (e)=>setActive(e));

        return ()=>{
            engineRef.current?.destroy();
        }
    }, []);

    function removeShape(){
        engineRef.current?.removeShape();
    }

    useEffect(()=>{
        if(!engineRef.current) return;
        engineRef.current.setTool(currTool)
    }, [currTool]);

    useEffect(()=>{
        engineRef.current?.setCurrentPage(page);
    }, [page])



    return(
        <div className="w-screen h-screen overflow-hidden relative">
            <canvas ref={canvasRef} id="canvas" className="w-screen h-screen"></canvas>

            {/* buttons */}
            <div className="absolute bg-gray-800 z-50 top-2 px-5 py-1 rounded-2xl right-[35%]">
                <div className="flex items-center gap-4 text-white">
                    {
                        Buttons.map((val)=>{
                            return(
                                // onclick currentTool select 
                                <div key={val.id} onClick={()=>{setCurrTool(val.shape as ToolType)}} className={`cursor-pointer p-2 rounded-lg transition-all duration-300 ${currTool === val.shape ? "bg-blue-500" : "hover:bg-gray-700"}`}>{val.btn}</div>
                            )
                        })
                    }
                </div>
            </div>
            
            <div className="top-2 right-10 text-white absolute flex items-center gap-5 ">
                <div onClick={()=>setOpen(true)}>
                    <UserRoundPlus size={20} className="cursor-pointer" onMouseEnter={()=>setShowFriend(true)} onMouseLeave={()=>setShowFriend(false)}/>
                    {showFriend && <span className="text-white px-3 top-9 py-1 w-[6rem] rounded-lg text-sm absolute right-12 bg-gray-700">invite friend</span>}
                </div>
                <Button
                    type="button"
                    text="Leave"
                    design="redbtn"
                    className="px-4 py-1 rounded-2xl"
                    onClick={()=>{setShowLeave(true)}}
                />
            </div>

            <div className="bottom-2 right-10 text-white absolute flex items-center gap-2">
                <Button
                    type="button"
                    text="prev"
                    className="px-2 py-1 rounded-lg"
                    design="outline"
                    onClick={()=>{setPage(prev => prev-1)}}
                />
                <span className="text-xs">{page}</span>
                <Button
                    type="button"
                    text="next"
                    className="px-2 py-1 rounded-lg"
                    design="outline"
                    onClick={()=>{setPage(prev => prev+1)}}
                />
            </div>
            
            
            <LeaveCanvasUI showLeave={showLeave} setShowLeave={setShowLeave} roomId={roomId}/>
            
            <InviteGenerator open={open} setOpen={setOpen}/>
            
            <ShapeSetting active={active} removeShape={removeShape} currTool={currTool}/>

            <CanvasNotificationUI/>

            <CanvasGroupMember/>
            
        </div>
    )
    // kon kon join hai wo dikhao side me-> ADMIN, MEMBER
}