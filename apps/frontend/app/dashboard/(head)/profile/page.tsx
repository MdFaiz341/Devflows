"use client"

import { motion } from "framer-motion";
import { DeleteAccount } from "../../../../components/DeleteAccount";
import { useHook } from "../../../../hook/useHook";
import { Camera, Lock, MoveLeft, Save, Trash2 } from "lucide-react";
import { useStore } from "../../../../Storage/useStore";
import { useRouter } from "next/navigation";
import { InputField } from "@repo/ui/input";
import { Button } from "@repo/ui/button";




export default function SettingsPage() {
  const user = useStore((state)=>state.user);
  const router = useRouter();
  const {open, setOpen} = useHook();

  return (
    <>
      <DeleteAccount open={open} setOpen={setOpen}/>
      <div className="min-h-screen bg-[#09090B] text-white">
        <div className="mx-auto max-w-7xl px-6 pt-5">
          <div className="mb-5 flex flex-col gap-3">
            <p className="text-sm font-medium text-zinc-400">Settings</p>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Account Settings
                </h1>

                <p className="mt-2 text-zinc-400">
                  Manage your profile, account details and preferences.
                </p>
              </div>

              <Button
                type="button"
                onClick={()=>router.push("/dashboard")} 
                design="outline" text="Back to Dashboard" 
                icon={<MoveLeft className="w-3"/>}
                iconFirst={true}
                className="flex gap-3 right-10 top-10 items-center text-xs rounded-2xl px-4 py-1 backdrop-blur-xl"
            />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="h-fit rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl shadow-black/20">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/300"
                    alt="profile"
                    className="h-28 w-28 rounded-full border-4 border-zinc-800 object-cover"
                  />

                  <button className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm transition hover:bg-zinc-800">
                    ✦
                  </button>
                </div>

                <h2 className="mt-4 text-xl font-semibold">Md Faiz</h2>

                <p className="mt-1 text-sm text-zinc-400">
                  faiz@example.com
                </p>
              </div>

              <div className="mt-8 space-y-14">
                <div className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-2 font-medium text-black">
                  <span>👤</span>
                  Profile
                </div>
                <div className="w-full">
                  <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
                  <Button
                      type="button"
                      text="Delete account"
                      design="redbtn"
                      onClick={()=>setOpen(true)}
                      className="flex items-center gap-2 px-5 py-2 "
                      icon={<Trash2 size={16} />}
                      iconFirst={true}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold">Personal Information</h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Update your details and public profile information.
                </p>
              </div>

              <form className="space-y-7">
                <div className="grid gap-6 md:grid-cols-2">
                  <InputField label="First Name" defaultValue={user?.firstname} disabled={false} />
                  <InputField label="Last Name" defaultValue={user?.lastname} disabled={false}/>
                  <InputField label="Email" defaultValue={user?.email} disabled={true}/>
                  <div>
                    <p className="mb-1.5 block text-xs font-medium text-white/70">Change password</p>
                    <Button text="Change password" design="primary" type="button" onClick={()=>router.push("/dashboard/profile/changepassword")} 
                        className=" py-2 w-full rounded-2xl"/>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">

                  {/* <Button
                    type="button"
                    design="outline"
                    className="rounded-2xl px-5 py-3"
                    text="Cancle"
                  /> */}
                  <Button
                    type="button"
                    text="Save Changes"
                    design="plane"
                    className="px-6 py-3"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
    // <>
    //     <DeleteAccount open={open} setOpen={setOpen}/>
    //     <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
    //     <motion.div
    //         initial={{ opacity: 0, y: 40 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
    //     >
    //         {/* Header */}
    //         <div className="flex justify-between items-center mb-6">
    //             <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
    //             <button 
    //                 className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl transition">
    //                 <Save size={18} /> Save
    //             </button>
    //         </div>

    //         {/* Profile Section */}
    //         <div className="flex items-center gap-6 mb-8">
    //             <div
    //                 className="relative"
    //                 onMouseEnter={() => {}}
    //                 onMouseLeave={() => {}}
    //             >
    //                 <img 
    //                     onClick={()=>{}}
    //                     src={user?.image}
    //                     className="w-28 h-28 object-cover cursor-pointer rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl text-white font-semibold shadow-lg">
    //                 </img>

    //                 {/* Hover Menu */}
    //                 {/* {hover && (
    //                 <motion.div
    //                     initial={{ opacity: 0, scale: 0.9 }}
    //                     animate={{ opacity: 1, scale: 1 }}
    //                     className="absolute top-0 left-28 bg-white text-black rounded-xl shadow-xl p-3 w-40"
    //                 >
    //                     <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
    //                         View Image
    //                     </button>

    //                     <button 
    //                         className=" w-full text-left px-2 py-1 hover:bg-gray-100 rounded flex items-center gap-2">
    //                         <Camera size={16} /> Update
    //                     </button>
    //                 </motion.div>
    //                 )} */}
    //             </div>

    //         <div>
    //             <h2 className="text-xl text-white font-semibold">{user?.firstname} {user?.lastname}</h2>
    //             <p className="text-gray-300 text-sm">Update your profile details</p>
    //         </div>
    //         </div>

    //         {/* Form */}
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //         <InputField label="First Name" defaultValue={user?.firstname} disabled={false} />
    //         <InputField label="Last Name" defaultValue={user?.lastname} disabled={false}/>
    //         <InputField label="Email" defaultValue={user?.email} disabled={true}/>

    //         <div className="flex flex-col">
    //             <label className="mb-1.5 block text-xs font-medium text-white/70">Password</label>
    //             <button 
    //                 onClick={()=>router.push("/dashboard/settings/change-password")}
    //                 className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition">
    //                     <Lock size={16} /> Change Password
    //             </button>
    //         </div>
    //         </div>

    //         {/* Danger Zone */}
    //         <div className="mt-10 border-t border-white/20 pt-6">
    //         <h3 className="text-red-400 font-semibold mb-3">Danger Zone</h3>
    //         <button 
    //             onClick={()=>setOpen(true)}
    //             className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition">
    //             <Trash2 size={16} /> Delete Account
    //         </button>
    //         </div>
    //     </motion.div>
    //     </div>
    // </>
  );
}
