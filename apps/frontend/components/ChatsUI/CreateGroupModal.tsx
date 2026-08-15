"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InputField } from "@repo/ui/input";
import { toast } from "sonner";
import api from "../../API/Interceptor";
import { useHook } from "../../hook/useHook";
import { useChatStore } from "../../Storage/useChatStore";
import { useStore } from "../../Storage/useStore";
import { useSocket } from "../../providers/SocketProvider";
import { chatCreation } from "../../lib/socket/socket-emit";
import { chatManager } from "../../lib/socket/ChatManager";



export default function CreateGroupModal({openGroupModal , setOpenGroupModalAction, dms}:{
  openGroupModal : boolean,
  setOpenGroupModalAction : (e:boolean)=>void,
  dms : number[],
}) {


  const {loading, setLoading} = useHook();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const groupName =  useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const sidebarDefaultConversation = useChatStore((state)=>state.sidebarDefaultConversation);
  const [dmsIds, setDmsIds] = useState<number[]>(dms);
  const user = useStore((state)=>state.user);
  const setSidebarDefaultConversation = useChatStore((state)=>state.setSidebarDefaultConversation)
  const sideConversationOrder = useChatStore((state)=>state.sideConversationOrder);
  const setSideConversationOrder = useChatStore((state)=>state.setSideConversationOrder);
  // const { socket } = useSocket();
  const socket = useSocket();


  // const filteredFriends = useMemo(() => {
  //   return usersName.filter((friend) =>
  //     friend.toLowerCase().includes(search.current?.value.toLowerCase())
  //   );
  // }, [search]);

  useEffect(()=>{
    setTimeout(() => {
      searchUser();
    }, 1000);
  }, [search, dms])


  function searchUser(){
    // console.log("search: ", searchRef.current?.value);
    // const search = searchRef.current?.value;
    console.log("search: ", search);
    if(!search){
      setDmsIds(dms);
      return;
    } 

    const filteredFriendsIds = dms.filter((ids)=>{
      const friend = sidebarDefaultConversation[ids];
      console.log("friend Filter: ", friend);
      return friend?.member[0].user.firstname.toLowerCase().includes(search.toLowerCase());
    })
    console.log("fliter-Friends: ", filteredFriendsIds);
    setDmsIds(filteredFriendsIds);
  }

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((userId) => userId !== id);
      }

      return [...prev, id];
    });
  };


  const handleCreateGroup = async() => {
    if(!groupName || !groupName.current?.value){
      toast.info("Please fill input box")
      return;
    }
    if(groupName.current?.value.length < 4){
        toast.info("Atleast four letters required")
        return;
    }
    try{
        // if(!socket || socket.readyState !== WebSocket.OPEN) return;

        setLoading(true);
        const payloadData = {
          groupName : groupName.current.value,
          memberIds: selectedUsers,
        };

        const response = await api.post("/group/create", payloadData);
        
        console.log("response-group: ", response.data.conversation);
        const val = response.data.conversation;

        const payload = {
            type : "chatCreation",
            conversationId : val.conversationId,
            data : val,
        }
        chatManager.sendMessage(payload);
        // chatCreation(socket, payload);

        await new Promise((res)=> setTimeout(res, 2000));
        toast.success(response.data.message);
        setSelectedUsers([]);
        setOpenGroupModalAction(false)
    }
    catch(e:any){
      console.log(e);
      toast.error(e.response.data.message)
    }finally{
      setLoading(false);
    }
  };

  return (
      <AnimatePresence>
        {
            openGroupModal && 
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-1 shadow-2xl relative">
                
                    {/* Header */}
                    <button
                        onClick={() => (setOpenGroupModalAction(false), setSelectedUsers([]))}
                        className="absolute rounded-full p-2 right-1 top-1 transition hover:bg-zinc-600"
                        >
                        <X className="size-5"/>
                    </button>
        
                    {/* Group Name */}
                    <div className="px-5 pt-4">
                      <InputField
                          label="Group name (Unique)"
                          type="text"
                          placeholder="Dev, Office etc"
                          ref={groupName}
                        />

                    </div>
                    <div className="px-5 absolute top-24 w-full">
                        <Search onClick={searchUser} className="size-4 text-zinc-400 absolute top-[35px] right-10 cursor-pointer" />
                        <InputField
                            label="Search friends"
                            placeholder="friends"
                            type="text"
                            onChange={(e)=>setSearch(e.target.value)}
                          />
                    </div>
        
                    {/* Friends List */}
                    <div className="h-[250px] overflow-y-auto px-3 py-2 mt-16">
                      {
                        dmsIds.length === 0 
                        ? <div className="flex items-center justify-center text-lg text-green-500 h-full">No friends</div>
                        : <div>
                              {dmsIds?.map((ids) => {
                                const friend = sidebarDefaultConversation[ids];
                                const checked = selectedUsers.includes(friend?.member[0].user.id!);
                                console.log("checked:", checked);
                                return (
                                    <label
                                      key={friend?.member[0].user.id}
                                      className={`mb-2 flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-1 transition ${
                                          checked
                                          ? "border-blue-500 bg-gray-600"
                                          : "border-transparent hover:bg-zinc-600"
                                      }`}
                                      >
                                      <div className="flex items-center gap-3">
                                          <div className="relative">
                                            <img
                                                src={friend?.member[0].user.image}
                                                className="size-12 rounded-full object-cover"
                                            />
                                          </div>
                      
                                          <div>
                                            <p className="font-medium text-zinc-100">
                                                {friend?.member[0].user.firstname}
                                            </p>
                                          </div>
                                      </div>
                                      
                                      <div>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleUser(friend?.member[0].user.id!)}
                                            className="size-4 accent-green-600"
                                        />
                                      </div>
                                  </label>
                                );
                                })}
                        </div>
                      }
                      
                        
                    </div>
            
                    {/* Footer */}
                    <div className="border-t p-4 border-gray-500">
                        <button
                          disabled={!groupName || selectedUsers.length === 0 || loading}
                          onClick={handleCreateGroup}
                          className="w-full rounded-2xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-zinc-500"
                          >
                            {
                              loading ? <div className="flex justify-center items-center gap-2">
                                <Loader2 size={20} className="animate-spin"/>
                                Creating...
                              </div>
                              : <>
                                Create Group ({selectedUsers.length})
                              </>
                            }
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        }
    </AnimatePresence>
    
  );
}