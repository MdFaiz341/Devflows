
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react";
import api from "../../API/Interceptor";
import { Button } from "@repo/ui/button";
import { Loader2, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import { useHook } from "../../hook/useHook";
import { useRouter } from "next/navigation";

export const JoinCanvasRoom = ({active, setActive}:{
    active : boolean,
    setActive : (e:boolean)=>void
})=>{
    const inputRef = useRef<HTMLInputElement>(null);
    const {open, setOpen} = useHook();
    const router = useRouter();

    async function joinRoomHandler(){
      const linkVal = inputRef.current?.value
      if(!linkVal){
        toast.info("Link required");
        return;
      }
      try{
        const data = linkVal?.split('/');
        setOpen(true);
        const roomId = data[data?.length-1];
        const adminId = data[data?.length-2];
        const randomLink = data[data.length-3];
        await new Promise((res)=>setTimeout(res, 2000));
        const response = await api.post(`/join_member/${randomLink}/${adminId}/${roomId}`)
        toast.success(response.data.message);
        router.push(`/dashboard/canvas/canvasroom/${adminId}/${roomId}`);
      }
      catch(e:any){
        toast.error(e.response.data.message || "Something went wrong")
      }finally{
        setOpen(false);
      }
    }


    return(
        <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Join Room</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Start collaborating with your team.
                  </p>
                </div>

                <button
                  onClick={() => setActive(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Link:
                  </label>

                  <input
                    ref={inputRef}
                    placeholder="http://xyz.com"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <Button
                    icon={open ? <Loader2 size={20} className="animate-spin"/> : <UserRoundPlus size={20}/>}
                    disabled={open && true}
                    iconFirst={true}
                    type="button"
                    text={`${open ? "Joining..." :"Join room"}`}
                    design="primary"
                    className={`rounded-xl w-full flex items-center justify-center gap-2 font-semibold px-6 py-2.5 shadow-[0_0_40px_rgba(99,102,241,0.55)] hover:scale-105 transition-all duration-300 ${open && "cursor-not-allowed"}`}
                    onClick={joinRoomHandler}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}