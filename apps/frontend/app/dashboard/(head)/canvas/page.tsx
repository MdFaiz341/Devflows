"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui/button";
import { CreateCanvasRoom } from "../../../../components/CanvasUI/CreateCanvasRoom";
import { History, Loader, Loader2, Menu, PlusIcon, UserRoundPlus, UsersRound } from "lucide-react";
import { useHook } from "../../../../hook/useHook";
import { JoinCanvasRoom } from "../../../../components/CanvasUI/JoinCanvasRoom";
import api from "../../../../API/Interceptor";
// import { CanvasCardFormat, useCanvasStore } from "../../../../Storage/useCanvasStore";
import { toast } from "sonner";
import { useStore } from "../../../../Storage/useStore";
import { CanvasRoomsCard } from "../../../../components/CanvasUI/CanvasRoomCard";
import { useCanvasStore } from "../../../../Storage/useCanvasStore";


export interface CanvasCardFormat{
    createdAt : string,
    roomId : number,
    image : string,
    name : string,
    members : [
        {
            joinedAt : string,
            role : "ADMIN" | "MEMBER",
            userId : string,
            user : {
                firstname : string,
                email : string,
                image : string,
            }
        },
    ]
}

export default function CanvasRoomsPage() {

  const [search, setSearch] = useState("");
  const {open, setOpen, active, setActive, loading, setLoading} = useHook();
  const [roomCreated, setRommCreated] = useState(false);
  const [rooms, setRooms] = useState<CanvasCardFormat[]>()

  // best filter
  // const filteredRooms = useMemo(() => {
  //   return rooms.filter((room) =>
  //     room.name.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [search]);

  async function getAllCanvas() {
    try{
      setLoading(true);
      const response = await api.get("/allCanvasRooms");
      console.log(response.data.allRooms);

      const data = response.data.allRooms.map((val:any)=>({
          createdAt : val.createdAt,
          roomId : val.id,
          image : val.image,
          name : val.name,
          members: val.members //filteredFriend,
      }))

      setRooms(data);
      
      // const dataVal = response.data.allRooms;
      // // const filteredFriend = dataVal.member.filter((adminId:any)=>adminId.userId !== user?.id)
      // dataVal.forEach((val:any)=>{
      //   console.log("val: ", val);

      //   // const filteredFriend = val.members.filter((adminId:any)=>{
      //   //     adminId.userId !== user?.id
      //   // })
      //   const value = {
      //     createdAt : val.createdAt,
      //     roomId : val.id,
      //     image : val.image,
      //     name : val.name,
      //     members: val.members //filteredFriend,
      //   }

      //   setRooms((prev)=>{
      //     if(prev){
      //       [...prev, value]
      //     }else{
      //       value
      //     }
      //   });
      //   // setCanvasCard(val.id, value);
      //   // setCanvasOrder(val.id);

      //   // createdAt : string,
      //   // roomId : number,
      //   // image : string,
      //   // name : string,
      //   // members : [
      //   //     {
      //   //         userId : string,
      //   //         role : "ADMIN" | "MEMBER",
      //   //         firstname : string,
      //   //         email : string,
      //   //         image : string,
      //   //         joinedAt : string,
      //   //     },
      //   // ]

      // })
      // // toast.success(response.data.message);
    }
    catch(e:any){
      console.log(e);
      toast.error(e?.response?.data.message || "Something went wrong");
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
      getAllCanvas();
      useCanvasStore.getState().clearCanvasRoom;
  }, []);

  function menuHandler(){

  }

  console.log("Rooms--- ", rooms);

  return (
    <div className="min-h-screen bg-[#05070D] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_40%)]" />

      {/* Navbar */}
      <header className="fixed top-1 right-0 left-0 z-50 border-b-2 border-white/10 bg-black/40 backdrop-blur-lg shadow-xl px-6 flex items-center justify-between h-16">
      
        <div className="flex md:gap-7">
          <div className="hidden md:block">
            <h1 className="text-3xl font-semibold ">Canvas Rooms</h1>
            <p className="text-xs text-gray-400">Collaborate in realtime</p>
          </div>
          {/* Search */}
          <div className="flex items-center gap-4">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="flex-1 bg-[#0F172A] border-2 border-white/10 rounded-2xl px-5 py-2 outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <Menu className="h-8 w-8 md:hidden block" onClick={menuHandler}/>

        <div className="flex gap-5 items-center">
          <Button type="button" design="outline" text="Join" 
              icon={<UserRoundPlus size={20}/>}
              iconFirst={true}
              className="rounded-xl hidden font-semibold md:flex px-6 py-2.5 md:items-center gap-2 shadow-[0_0_40px_rgba(99,102,241,0.55)] hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              onClick={()=>setActive(true)}
            />
          <Button type="button" design="designedPrimary" text="Create Room" 
              icon={<PlusIcon size={20}/>}
              iconFirst={true}
              className="rounded-xl hidden md:flex font-semibold px-4 py-2.5 items-center gap-2 shadow-[0_0_40px_rgba(99,102,241,0.55)]"
              onClick={()=>setOpen(true)}
            />
        </div>

      </header>

      {/* Content */}
      {
        loading 
        ? 
          <div className="w-screen h-screen flex justify-center items-center">
                <Loader size={30} className="animate-spin"/>
          </div>
        : !rooms || rooms?.length === 0
        ? <div className="w-screen h-screen flex justify-center items-center">
            <Button
              type="button"
              icon={<History size={20}/>}
              iconFirst={true}
              design="outline"
              text="Refresh"
              className="px-4 py-2 flex items-center font-semibold gap-3 shadow-[0_0_40px_rgba(99,102,241,0.65)]"
              onClick={getAllCanvas}
            />
        </div>
        :  <div>
              <CanvasRoomsCard rooms={rooms}/>
          </div>
      }
      

      {/* Create Room Modal */}
      <CreateCanvasRoom open={open} setOpen={setOpen} setRommCreated={setRommCreated} getAllCanvas={getAllCanvas}/>
      <JoinCanvasRoom active={active} setActive={setActive}/>
      {/* { 3 dot pe click karege to ek popUp open ho jisme URL generate hoga like http://localhost:3003/dashboard/canvas/{UserId_In_String}
       In backend:-
          jo bhi member add hona chahta hai wo link ko paste karega apne-apne canvas k join popup me then Backend checks
          first get UserID from query and find user exist and also room exist with this userId means this User ne room create kiya hai ki nahi
          then joiny member ko with same conversationId me join kardenege as a (member) } */}

    </div>
  );
}

// const rooms = [
//   {
//     id: 1,
//     name: "Frontend Canvas",
//     description: "Realtime UI collaboration and whiteboarding.",
//     members: 12,
//     online: 4,
//   },
//   {
//     id: 2,
//     name: "DevFlow Core",
//     description: "Architecture discussions and backend planning.",
//     members: 18,
//     online: 6,
//   },
//   {
//     id: 3,
//     name: "Design Team",
//     description: "Wireframes, flows, and design systems.",
//     members: 9,
//     online: 2,
//   },
//   {
//     id: 4,
//     name: "Realtime Engine",
//     description: "WebSocket scaling and sync optimizations.",
//     members: 14,
//     online: 5,
//   },
//   {
//     id: 5,
//     name: "Product Ideas",
//     description: "Brainstorming new features and roadmap.",
//     members: 7,
//     online: 3,
//   },
// ];
