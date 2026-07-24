"use client"

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import {toast} from "sonner";
import { useStore } from "../../../../../Storage/useStore";
import api from "../../../../../API/Interceptor";
import { useRouter } from "next/navigation";
import { useHook } from "../../../../../hook/useHook";
import { InputField } from "@repo/ui/input";
import { Button } from "@repo/ui/button";



export default function ChangePassword() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { loading, setLoading } = useHook();  // changed

  const oldRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const conRef = useRef<HTMLInputElement>(null);

  const router = useRouter();


  const handleSubmit = async () => {
    try{
        const oldInput = oldRef.current?.value;
        const newInput = newRef.current?.value;
        const conInput = conRef.current?.value;
        if(!oldInput || !newInput || !conInput){
            alert("Fill all details");
            return;
        }
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1500));
        const response = await api.post("/changePassword", {
            oldPassword:oldInput,
            newPassword:newInput,
            confirmPassword:conInput,
        });
        useStore.getState().logout();

        // ============ MAY BE CREATE PROBLEM HERE WITHOUT DELETING COOKIE WE TRY TO GO SIGNIN=======================
        router.push("/signin");
        toast.success(response.data.message);
    }
    catch(e:any){
        toast.error(e.response.data.message || "Password not updated")
    } finally{
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock className="text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* Old Password */}
          <div className="relative">
            <InputField
                label="Old password"
                type={showOld ? "text" : "password"}
                placeholder="••••••••"
                ref={oldRef}
                />
            <Button 
                    type="button"
                    onClick={()=>setShowOld(!showOld)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    icon={showOld ? <EyeOff size={18}/> : <Eye size={18}/>}
                />
          </div>

          {/* New Password */}
          <div className="relative">
            <InputField
                label="New password"
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                ref={newRef}
            />
            <Button 
                    type="button"
                    onClick={()=>setShowNew(!showNew)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    icon={showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <InputField
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                ref={conRef}
            />
            <Button 
                    type="button"
                    onClick={()=>setShowConfirm(!showConfirm)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    icon={showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                />
          </div>
        </div>

        {/* Button */}
        <Button
            design="primary"
            text="Update password"
            type="button"
            onClick={handleSubmit}
            className=" mt-8 w-full py-2 rounded-xl"
        />
      </motion.div>
    </div>
  );
}
