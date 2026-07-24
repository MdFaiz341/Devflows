import { ReactNode, useId } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";


interface InputFieldProps{
    label : string,
    type? : string,
    placeholder? : string,
    registration? : UseFormRegisterReturn,
    error? : FieldError
    alerIcon? : ReactNode
    disabled? : boolean
    defaultValue? : string
    ref? : React.Ref<HTMLInputElement>
    funcn? : any,
    onChange? : (e:any)=>void
}


export const InputField = ({label, type, placeholder, registration, error, alerIcon, disabled, defaultValue, ref, funcn, onChange}:InputFieldProps)=>{
    const id = useId();
    return(
        <div className="text-white">
            <label className="mb-1.5 block text-xs font-medium text-white/70">
                {label}
            </label>

            <input 
                onChange={onChange}
                ref={ref}
                onKeyDown={(e)=>{
                    if(e.key === "Enter"){
                        funcn && funcn()
                    }
                }}
                defaultValue={defaultValue}
                disabled={disabled}
                type={type} 
                placeholder={placeholder} 
                {...registration}
                className={`w-full rounded-2xl border bg-white/[0.03] px-4 py-2 outline-none transition 
                    ${disabled && "cursor-not-allowed"}
                    ${error
                        ? "border-red-400/60 shadow-[0_0_0_3px_rgba(248,113,113,0.12)]"
                        : "border-white/10 focus:border-indigo-500"
                }`}
            />

            {/* {error && (
                <p className="mt-2 text-sm text-red-400">
                    {error.message}
                </p>
            )} */}

            <div className="mt-1.5 min-h-[18px] text-[12px] leading-tight">
                {error && (
                    <span
                        id={`${id}-err`}
                        className="flex align-baseline gap-1 text-red-400"
                    >
                        {alerIcon}
                        {error.message}
                    </span>
                )}
            </div>
        </div>
    )
}