

import { motion } from "framer-motion"
import { useCanvasStore } from "../../Storage/useCanvasStore"
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import { useSocket } from "../../providers/SocketProvider";
import { CanvasCardFormat } from "../../app/dashboard/(head)/canvas/page";




export const CanvasRoomsCard = ({rooms}:{
    rooms : CanvasCardFormat[]
})=>{
    const router = useRouter();
    const socket = useSocket();
    const canvasCard = useCanvasStore((state)=>state.canvasCard);
    const canvasOrder = useCanvasStore((state)=>state.canvasOrder);
    const setCurrentRoomId = useCanvasStore((state)=>state.setCurrentRoomId);

    async function joinCanvasRoon(roomId:number, adminId:string) {
        console.log("joinRoomId: ", roomId);
        setCurrentRoomId(roomId);
        const payload = {
            type : "join_canvasroom",
            roomId,
        }
        socket.send(payload)
        console.log("Join-canvas----");  
        router.push(`/dashboard/canvas/canvasroom/${adminId}/${roomId}`);
    }

    console.log("canvasOrder-- ", canvasOrder);
    console.log("canvasCARD------- ", canvasCard);

    return(
        <main className="max-w-7xl mx-auto px-6 py-10 mt-16">
            {/* Rooms Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    rooms.map((val) => {
                        // const cards = canvasCard[roomId];
                        console.log("Each_card--- ", val);
                        const userRole = val.members.find((userId)=>userId.role === "ADMIN");
                        console.log("adminId: ", userRole?.userId);
                        return(
                            <motion.div
                                key={val.roomId}
                                whileHover={{ y: -6 }}
                                className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-indigo-500/40 transition overflow-hidden relative hover:bg-gradient-to-br from-gray-800 to-gray-950"
                            >
                                {/* Glow */}

                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <img src={val.image} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold shadow-lg">
                                            {/* <img src={cards.image}/> */}
                                        </img>

                                        <span className="text-xs text-green-400">
                                        {/* ● {room.online} online */}  2 Online
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-semibold mb-2">{val.name}</h2>

                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {/* {room.description}  */} Description.......
                                    </p>

                                    <div className="mt-6 flex items-center justify-between text-sm">
                                        <span className="text-gray-500">
                                        {val.members.length} members
                                        </span>
                                        <Button
                                            text="Join"
                                            type="button"
                                            design="primary"
                                            className="px-4 py-2 rounded-lg"
                                            onClick={()=>joinCanvasRoon(val.roomId, userRole?.userId!)}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                }
            </div>
            </main>
    )
}