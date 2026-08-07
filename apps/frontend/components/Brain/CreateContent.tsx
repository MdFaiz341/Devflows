

import { Button } from "@repo/ui/button"
import { InputField } from "@repo/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { CirclePlus, Cross, Download, X } from "lucide-react"
import { HtmlHTMLAttributes, useRef, useState } from "react"

const allTags = [
  "Ai",
  "Technology",
  "Trends"
]

export const CreateContent = ({open, setOpen}:{
  open:boolean,
  setOpen : (e:boolean)=>void
})=>{

  const [selectTags, setSelectTags] = useState<string[]>([]);
  const inputTagsRef = useRef<HTMLInputElement>(null);

  function selectedTagsHandler(val:string){
    if(selectTags.includes(val)) return;

    setSelectTags((prev)=>(
      [...prev, val]
    ))
  }

  function saveHandler(){

  }

  function removeSelectTags(tag:string){
    const filterTags = selectTags.filter((val)=>val !== tag)
    setSelectTags(filterTags);
  }

  return(
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex ${open ? "block" : "hidden"} items-center justify-center z-50 px-4`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-7 shadow-2xl"
          >
            <div className="flex flex-col justify-between text-white">
              <p className="text-xl font-bold text-blue-600">Save into memory</p>
              <p className="text-xs text-gray-500">hdgsjfhgfayuwilsdjhdsgdhjkdah</p>
            </div>

            {/* Inputs */}
            <div>
              <div>
                <InputField
                  label="Title"
                  type="text"
                  placeholder="trending technology, gadgets, information etc."
                />
              </div>

              <div>
                <InputField
                  label="Link"
                  type="text"
                  placeholder="https://xyz.com"
                />
              </div>
            </div>

            {/* Tags */}
            <p className="text-gray-300 mb-2 text-sm">Tags:</p>
            <div className={` text-gray-300 flex items-center gap-3 text-xs flex-wrap ${selectTags.length !== 0 && "mb-3" }`}>
              {
                selectTags.map((tag, index)=>{
                  return(
                      <div key={index} className="relative px-2 py-1 rounded-xl">
                        {tag}
                        
                        <CirclePlus size={14} onClick={()=>removeSelectTags(tag)}
                          className="absolute text-white -top-2 right-0 rotate-45 z-10 cursor-pointer"/>
                      </div>
                  )
                })
              }
            </div>

            <div className="flex w-full justify-between items-center">
              <div className="text-xs flex gap-2">
                {allTags.map((tag, index)=>{
                  return(
                    <div key={index}>
                      <Button type="button" text={tag} design="outline" onClick={()=>selectedTagsHandler(tag)}
                        className="px-2 py-1 rounded-xl text-gray-300 bg-gray-700"
                        />
                    </div>
                  )
                })}
              </div>
              
              {/* Inputs */}
              <div>
                <input
                  onKeyDown={(e)=>{
                    if(e.key === "Enter"){
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if(!value) return;
                      selectedTagsHandler(value)
                      e.currentTarget.value = ""
                    }
                  }}
                  type="text"
                  ref={inputTagsRef}
                  placeholder="#Tags"
                  className="w-44 rounded-2xl border text-sm bg-white/[0.03] text-white px-2 py-1 outline-none transition border-white/10 focus:border-indigo-500"
                  autoFocus={true}
                />
              </div>
            </div>

            {/* // Submit Buttons */}
            <div className="flex w-full">
                <Button type="button" text="Cancle" icon={<Cross size={20}/>} 
                iconFirst={true} className="flex gap-3 items-center justify-center rounded-lg"
                onClick={()=>setOpen(false)} design="outline"
                />
                <Button type="button" text="Save" icon={<Download size={20}/>} 
                iconFirst={true} className="flex gap-3 items-center justify-center rounded-lg"
                onClick={saveHandler} design="primary"
                />
            </div>

          </motion.div>
        </motion.div>
      </AnimatePresence>
  )
}