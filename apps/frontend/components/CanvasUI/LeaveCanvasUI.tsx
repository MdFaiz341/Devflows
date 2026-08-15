

import { Button } from "@repo/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useHook } from "../../hook/useHook"
import api from "../../API/Interceptor"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


export const LeaveCanvasUI = ({showLeave, setShowLeave, roomId}:{
    showLeave : boolean,
    setShowLeave : (e:boolean)=>void,
    roomId : number,
})=>{

    const {active, setActive} = useHook();
    const router = useRouter();

    // const canvasOrder = 

    async function leaveHandler(){
        try{
            setActive(true);
            await new Promise((res)=>setTimeout(res, 3000))
            const response = await api.post("/leaveCanvasRoom", {roomId});
            router.push("/dashboard/canvas");
            toast.success(response.data.message);
        }
        catch(e:any){
            toast.error(e?.response.data.message || "Something went wrong")
        }finally{
            setActive(false);
        }
    }


    return(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex ${showLeave ? "block" : "hidden"} items-center justify-center z-50 px-4`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-7 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Leave canvas room</h2>
                    <button
                        onClick={() => setShowLeave(false)}
                        className="text-gray-400 hover:text-white text-xl"
                        >
                        ×
                    </button>
                </div>

                <p className="text-sm text-gray-400 mt-1 mb-5">
                    Once you leave this room you can't rejoin to this room until the link is valid
                </p>

                <Button
                    type="button"
                    disabled={active && true}
                    iconFirst={true}
                    icon={active && <Loader2 size={20} className="animate-spin"/>}
                    text={active ? "Leaving...." : "Leave"}
                    design="redbtn"
                    className={`w-full py-2 flex justify-center items-center gap-4 rounded-2xl font-semibold ${active && "cursor-not-allowed"}`}
                    onClick={leaveHandler}
                />
            </motion.div>
          </motion.div>
        
      </AnimatePresence>
    )
}