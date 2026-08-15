"use client"

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupZodSchema, signinZodSchema } from "@repo/common/common";
import { useForm } from "react-hook-form";
import { AlertCircle, Eye, EyeOff, Loader2, MoveLeft } from "lucide-react";
import { Button } from "@repo/ui/button";
import { InputField } from "@repo/ui/input";
import { useRouter } from "next/navigation";
import api from "../API/Interceptor";
import { toast } from "sonner";


type AuthMode = "signin" | "signup";

interface AuthFormProps {
    mode : AuthMode;
}

type AuthFormData = {
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
};


export const AuthForm = ({mode} : AuthFormProps)=>{

    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const schema = mode === "signin" ? signinZodSchema : signupZodSchema

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AuthFormData>({
        resolver : zodResolver(schema),
    });


    async function onSubmit(data: AuthFormData) {  
        try {
            const response = await api.post(`${mode}`, data);

            toast.success(response.data.message);
            router.push(`${mode === "signin" ? '/dashboard' : '/signin'}`);
        } 
        catch (error:any) {
            toast.error(error.response.data.message || "Something went wrong")
        }
    }


    return(
        <main className="flex min-h-screen items-center justify-center bg-black px-4">
            {/* go to home button */}
            <Button
                type="button"
                onClick={()=>router.push("/")} 
                design="outline" text="Back to home" 
                icon={<MoveLeft className="w-3"/>}
                iconFirst={true}
                className="absolute z-50 flex gap-3 text-white right-10 top-10 items-center text-xs rounded-2xl px-4 py-1 backdrop-blur-xl transition hover:bg-gray-700"
            />

            <div className="w-full text-white max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg shadow-2xl">

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        {mode === "signin" ? "Welcome Back 👋" : "Create Account"}
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        {mode === "signin"
                            ? "Login to continue"
                            : "Signup to get started"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name */}
                    {mode === "signup" && (
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                type="text"
                                placeholder="John"
                                registration={register("firstname")}
                                label="First name"
                                error={errors?.firstname}
                                alerIcon={<AlertCircle className="h-3.5 w-3.5"/>}
                            />

                            <InputField
                                type="text"
                                placeholder="Doe"
                                registration={register("lastname")}
                                label="Last name"
                                error={errors?.lastname} 
                                alerIcon={<AlertCircle className="h-3.5 w-3.5"/>}
                            />

                        </div>
                    )}

                    {/* Email */}
                    <InputField
                        type="text"
                        placeholder="you@example.com"
                        registration={register("email")}
                        label="Email"
                        error={errors.email}
                        alerIcon={<AlertCircle className="h-3.5 w-3.5"/>}
                    />

                    {/* Password */}
                    <div className="relative">
                        <InputField
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            registration={register("password")}
                            label="Password"
                            error={errors.password}
                            alerIcon={<AlertCircle className="h-3.5 w-3.5"/>}
                        />
                        <Button 
                            type="button"
                            onClick={()=>setShowPassword(!showPassword)} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            icon={showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        />

                        {mode === "signin" && (
                            <Button 
                                type="button"
                                onClick={()=>router.push("/forgot-password")}
                                className="absolute right-4 top-[90%] -translate-y-1/2 text-xs text-indigo-400 hover:text-indigo-300"
                                text="Forgot Password?"
                            />
                        )}

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full" />
                        {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating account…
                        </>
                        ) : (
                            `${mode === "signin" ? "Sign In" : "Create Account"}`
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-400">
                    {
                        mode === "signin"
                            ? "Don't have an account?"
                            : "Already have an account?"
                    }

                    <span onClick={()=>router.push(`${mode === "signin" ? "/signup" : "signin"}`)} 
                        className="ml-2 cursor-pointer text-blue-400 hover:text-blue-300">
                        {mode === "signin" ? "Signup" : "Signin"}
                    </span>
                </p>
            </div>

        </main>
    )
}