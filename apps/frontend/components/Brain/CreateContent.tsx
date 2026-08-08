

import { Button } from "@repo/ui/button"
import { InputField } from "@repo/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { CirclePlus, Cross, Download, Loader, X } from "lucide-react"
import { HtmlHTMLAttributes, useRef, useState } from "react"
import { useHook } from "../../hook/useHook"
import { toast } from "sonner"
import api from "../../API/Interceptor"

const allTags = [
  "Ai",
  "Technology",
  "Trends"
]

export const CreateContent = ({open, setOpen, getContentApi}:{
  open:boolean,
  setOpen : (e:boolean)=>void,
  getContentApi : ()=>void
})=>{

  const [selectTags, setSelectTags] = useState<string[]>([]);
  const inputTagsRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState("");
  const {loading, setLoading} = useHook();

  function selectedTagsHandler(val:string){
    if(selectTags.includes(val)) return;

    setSelectTags((prev)=>(
      [...prev, val]
    ))
  }

  async function saveHandler(){
        try{
            const link = linkRef.current?.value;
            const title = titleRef.current?.value;
            if(!link || !title){
                alert("Fill all requirements");
                return;
            }
            if( selectTags.length === 0){
              alert("Enter some #Tags")
              return;
            }
            setLoading(true);

            const finalTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
            console.log("finalTitle--- ", finalTitle);

            const resposne = await api.post("/content", {
                link,
                finalTitle,
                type,
                selectTags
            });
            toast.success(resposne.data.message);
            getContentApi();
            // Clear form
            if (titleRef.current) {
              titleRef.current.value = "";
            }
            if (linkRef.current) {
              linkRef.current.value = "";
            }

            if (inputTagsRef.current) {
              inputTagsRef.current.value = "";
            }

            setType("");
            
            // clear tags state too, if you have one
            setSelectTags([]);
            
            setOpen(false);
        }
        catch(e:any){
            toast.error(e.resposne?.data.message || "Not able to add content");
        }
        finally{
            setLoading(false);
        }
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
            className="w-full max-w-md bg-[#0F172A] border border-white/10 flex flex-col rounded-3xl p-7 shadow-2xl"
          >
            <div className="flex flex-col justify-between text-white">
              <p className="text-xl font-bold text-blue-600">Save into memory</p>
              <p className="text-xs text-gray-500">hdgsjfhgfayuwilsdjhdsgdhjkdah</p>
            </div>

            {/* Inputs */}
            <div className="mt-6">
              <InputField
                label="Title"
                type="text"
                ref={titleRef}
                placeholder="trending technology, gadgets, information etc."
              />
            </div>

            <div>
              <InputField
                label="Link"
                type="text"
                ref={linkRef}
                placeholder="https://xyz.com"
              />
            </div>

            {/* Tags */}
            <div className={` text-gray-300 flex items-center gap-3 text-xs flex-wrap`}>
              <p className="text-gray-300 text-sm">Tags:</p>
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

            <div className="flex w-full justify-between items-center mt-2">
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
                  className="w-48 rounded-2xl border text-sm bg-white/[0.03] text-white px-2 py-1 outline-none transition border-white/10 focus:border-indigo-500"
                  autoFocus={true}
                />
              </div>
            </div>

            <div className="flex items-center mt-6 gap-3 text-gray-300 text-sm">
              <div className="flex items-center space-x-1 ">
                  <input type="radio" 
                        id="Youtube" 
                        name="linkType" 
                        value="Youtube"/>
                  <label htmlFor="Youtube" className="cursor-pointer" onClick={()=>setType("youtube")}>Youtube</label>
              </div>

              <div className="flex items-center space-x-1">
                  <input type="radio" 
                        id="Twitter" 
                        name="linkType" 
                        value="Twitter"/>
                  <label htmlFor="Twitter" className="cursor-pointer" onClick={()=>setType("twitter")}>Twitter</label>
              </div>

              <div className="flex items-center space-x-1">
                  <input type="radio" 
                        id="Github" 
                        name="linkType" 
                        value="Github"/>
                  <label htmlFor="Github" className="cursor-pointer" onClick={()=>setType("github")}>Github</label>
              </div>

              <div className="flex items-center space-x-1">
                  <input type="radio" 
                        id="Website" 
                        name="linkType" 
                        value="Website"/>
                  <label htmlFor="Website" className="cursor-pointer" onClick={()=>setType("website")}>Website</label>
              </div>
              <div className="flex items-center space-x-1">
                  <input type="radio" 
                        id="Linkedin" 
                        name="linkType" 
                        value="Linkedin"/>
                  <label htmlFor="Linkedin" className="cursor-pointer" onClick={()=>setType("linkedin")}>Linkedin</label>
              </div>
            </div>   
              


            {/* // Submit Buttons */}
            <div className="flex w-full items-center justify-between gap-2 mt-5">
                <Button type="button" text="Cancle" icon={<Cross size={17} className=" rotate-45"/>} 
                iconFirst={true} className="flex w-full gap-3 py-1 items-center justify-center rounded-lg"
                onClick={()=>setOpen(false)} design="outline"
                />
                <Button type="button" text="Save" icon={loading ? <Loader size={20} className=" animate-spin"/> : <Download size={20}/>} 
                iconFirst={true} className="flex w-full gap-3 py-1 items-center justify-center rounded-lg"
                onClick={saveHandler} design="primary"
                />
            </div>

          </motion.div>
        </motion.div>
      </AnimatePresence>
  )
}