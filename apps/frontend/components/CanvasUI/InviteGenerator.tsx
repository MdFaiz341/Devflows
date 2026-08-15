


import { motion, AnimatePresence } from "framer-motion"
import { useHook } from "../../hook/useHook"
import { ArrowRight, Copy, Loader, RotateCw } from "lucide-react";
import { useCanvasStore } from "../../Storage/useCanvasStore";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../../Storage/useStore";
import { Button } from "@repo/ui/button";
import { toast } from "sonner";
import api from "../../API/Interceptor";




export const InviteGenerator = ({open, setOpen}:{
    open : boolean,
    setOpen : (e:boolean)=>void
})=>{
    const currentRoomId = useCanvasStore((state)=>state.currentRoomId);
    const user = useStore((state)=>state.user);
    const {active, setActive} = useHook();
    const [linkVal, setLinkVal] = useState("");

    async function readyURL() {
      try{
        setActive(true);
        const response = await api.post("/link_generation", {roomId : currentRoomId});
        setLinkVal(response.data.link);
        toast.success(response.data.message);
      }
      catch(e:any){
        toast.error(e.response.data.message || "Something went wrong");
      }finally{
        setActive(false);
      }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(linkVal);
        toast.success("Copied!")
    };

    return(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex ${open ? "block" : "hidden"} items-center justify-center z-50 px-4`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Invite friend</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Start collaborating with your team.
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5">
                {
                  linkVal != "" 
                  && <div className="flex justify-between items-center gap-5">
                        <input
                            value={linkVal}
                            disabled
                            placeholder="Enter room name"
                            className="w-full bg-black/30 text-white border border-white/10 rounded-xl px-4 py-3 outline-none border-indigo-500 transition"
                        />
                        <Button
                          type="button"
                          icon={<Copy/>}
                          onClick={handleCopy}
                          design="outline"
                          className="rounded-lg p-2 cursor-pointer hover:scale-110 transition-all duration-300 bg-gray-700"
                        />
                    </div>
                }

                <Button
                  type="button"
                  disabled={active && true}
                  iconFirst={true}
                  icon={active ? <Loader size={20} className="animate-spin"/> : <RotateCw size={15}/>}
                  text={active ? "Generating...." : "Generate Link"}
                  design="primary"
                  className={`w-full py-2 flex justify-center items-center gap-3 rounded-2xl font-semibold shadow-[0_0_40px_rgba(99,102,241,0.55)] ${active && "cursor-not-allowed"}`}
                  onClick={readyURL}
                />
              </div>
            </motion.div>
          </motion.div>
      </AnimatePresence>
    )
}