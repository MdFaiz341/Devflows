"use client"

import { DeleteAccount } from "../../../../components/DeleteAccount";
import { useHook } from "../../../../hook/useHook";
import { MoveLeft, Trash2 } from "lucide-react";
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

                  <Button
                    onClick={()=>{}}
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
  );
}
