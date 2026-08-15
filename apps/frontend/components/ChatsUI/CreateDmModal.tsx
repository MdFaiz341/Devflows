"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRef } from "react";
import api from "../../API/Interceptor";
import { InputField } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useHook } from "../../hook/useHook";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useChatStore } from "../../Storage/useChatStore";
import { useStore } from "../../Storage/useStore";
import { useSocket } from "../../providers/SocketProvider";
import { chatCreation } from "../../lib/socket/socket-emit";
import { chatManager } from "../../lib/socket/ChatManager";

interface PropsTye{
    addContact : boolean,
    setAddContact : (e:boolean)=>void
}

  // notification pe jab click ho to defaultConversation ka data dikhe and user click kare to
  // redirect ho jaye and count reduce ho jaye notification ka

export const CreateDmModal = (props:PropsTye)=>{

    const user = useStore((state)=>state.user);
    const emailInput = useRef<HTMLInputElement>(null)
    const {loading, setLoading} = useHook();
    const setSidebarDefaultConversation = useChatStore((state)=>state.setSidebarDefaultConversation);
    const setSideConversationOrder = useChatStore((state)=>state.setSideConversationOrder);
    const sideConversationOrder = useChatStore((state)=>state.sideConversationOrder);
    // const { socket } = useSocket();
    // const socket = useSocket();

    async function chatHandler(){
      const email = emailInput.current?.value

      if(!email){
        toast.error("Please fill input box")
        return;
      }
      try{ 
        // if(!socket || socket.readyState !== WebSocket.OPEN) return;
        setLoading(true);
        const response = await api.post("/dm/create", {email});
        console.log("response-DM: ", response.data.conversation);

        const val = response.data.conversation;
        
        const payload = {
          type : "chatCreation",
          conversationId : val.conversationId,
          data : val,
        }
        chatManager.sendMessage(payload);
        // socket.send(payload);
        // chatCreation(socket, payload);

        await new Promise((res)=> setTimeout(res, 2000));
        toast.success(response.data.message);
        props.setAddContact(false)
      }
      catch(e:any){
        console.log(e);
        if(e.status === 500){
          toast.error(e.response.data.message);
        }else{
          toast.info(e.response?.data.message);
        }
      }finally{
        setLoading(false);
      }
    }


    return(
        <AnimatePresence>
        {props.addContact && (
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
                  <h2 className="text-2xl font-semibold">Add Contact</h2>
                </div>

                <button
                  onClick={() => props.setAddContact(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5">
                  <InputField
                      label="Email"
                      ref={emailInput}
                      placeholder="friend@gmail.com"
                  />
              </div>   
                 
              <Button
                  type="button"
                  text={loading ? "Creating..." : "Let's chat"}
                  className={`py-2 px-3 w-full rounded-2xl flex items-center justify-center gap-3 cursor-pointer ${loading && "cursor-not-allowed"}`}
                  design="primary"
                  onClick={chatHandler}
                  icon={loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  iconFirst={true}
              />          
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}