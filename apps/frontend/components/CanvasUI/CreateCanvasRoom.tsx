"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react";
import api from "../../API/Interceptor";
import { Button } from "@repo/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { toast } from "sonner";
import { useHook } from "../../hook/useHook";
import { useCanvasStore } from "../../Storage/useCanvasStore";

interface PropsTye{
    open : boolean,
    setOpen : (e:boolean)=>void
    setRommCreated : (e:boolean)=>void
    getAllCanvas : ()=>void
} 

export const CreateCanvasRoom = (props:PropsTye)=>{

    const roomInput = useRef<HTMLInputElement>(null);
    const setCanvasOrder = useCanvasStore((state)=>state.setCanvasCard)

  
    const {active, setActive} = useHook();

    async function createRoomHandler(){
      const name = roomInput.current?.value
      if(!name){
        toast.info("Enter room name");
        return;
      }
      try{
        setActive(true);
        await new Promise((res)=>setTimeout(res, 4000));
        const response = await api.post("/createCanvasRoom", {name})

        const payload = {
          type : "createCanvasRoom",
          
        }


        props.setRommCreated(true);
        toast.success(response.data.message);
        props.getAllCanvas();
        props.setOpen(false);
      }
      catch(e:any){
        toast.error(e.response.data.message || "Something went wrong")
      }finally{
        setActive(false)
      }
    }


    return(
        <AnimatePresence>
        {props.open && (
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
                  <h2 className="text-2xl font-semibold">Create Room</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Start collaborating with your team.
                  </p>
                </div>

                <button
                  onClick={() => props.setOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Room Name
                  </label>

                  <input
                    ref={roomInput}
                    placeholder="Enter room name"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {/* <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Write room description"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none resize-none focus:border-indigo-500 transition"
                  />
                </div> */}

                <Button
                  type="button"
                  disabled={active && true}
                  iconFirst={true}
                  icon={active ? <Loader size={20} className="animate-spin"/> : <ArrowRight size={20}/>}
                  text={active ? "Creating..." : "Create room"}
                  design="designedPrimary"
                  className={`w-full py-3 justify-center gap-2 rounded-2xl font-semibold ${active && "cursor-not-allowed"}`}
                  onClick={createRoomHandler}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}