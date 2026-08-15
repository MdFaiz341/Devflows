"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { socketManager } from "../lib/socket/SocketManager";
import { useStore } from "../Storage/useStore";



interface SocketContextType{
    connect: () => void;
    disconnect: () => void;
    send: (payload: any) => void;
}

export const SocketContext = createContext<SocketContextType | null>(socketManager);


export const SocketProvider = ({children}:{children:React.ReactNode})=>{
    const user = useStore((state)=>state.user);
  
    useEffect(()=>{
        if(!user) return;

        socketManager.connect();


        return ()=>{
            socketManager.disconnect();
        }

    }, [user])

    return(
        <SocketContext.Provider value={socketManager}>
            {children}
        </SocketContext.Provider>
    )
}


export function useSocket() {

  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used inside SocketProvider"
    );
  }

  return context;
}

