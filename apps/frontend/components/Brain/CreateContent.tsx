
// import { useRef, useState } from "react";
// import { RxCross2 } from "react-icons/rx";
// // import { AnimatePresence, motion } from "framer-motion";
// import { motion, AnimatePresence } from "framer-motion";
// import {toast} from "sonner";
// import { Check } from "lucide-react";
// import { useHook } from "../../hook/useHook";
// import api from "../../API/Interceptor";


// const ContentType: Record<string, string> = {
//     "Youtube": "youtube",
//     "Twitter": "twitter",
//     "Image" : "image"
// }

// export const CreateContent = ({open, setOpen}:{
//     open:boolean,
//     setOpen:(e:boolean)=>void
// })=>{

//     const titleRef = useRef<HTMLInputElement>(null);
//     const linkRef = useRef<HTMLInputElement>(null);
//     const { loading, setLoading } = useHook();

//     const [type, setType] = useState(ContentType["Youtube"]);

//     async function submitHandler(){
//         try{
//             const link = linkRef.current?.value;
//             const title = titleRef.current?.value;
//             if(!link || !title){
//                 alert("Fill all requirements");
//                 return;
//             }
//             setLoading(true);

//             await new Promise((res) => setTimeout(res, 3000));

//             const resposne = await api.post("/content", {
//                 link,
//                 title,
//                 type,
//             });
//             toast.success(resposne.data.message);
//             setOpen(false);
//         }
//         catch(e:any){
//             toast.error(e.resposne?.data.message || "Not able to add content");
//         }
//         finally{
//             setLoading(false);
//         }
//     }

//     return(
//         // <AnimatePresence>
//         //     <motion.div
//         //         className={`fixed inset-0 ${open ? "block" : "hidden"} z-50 flex items-center justify-center backdrop-blur-md bg-black/40`}
                
//         //         // Overlay animation
//         //         initial={{ opacity: 0 }}
//         //         animate={{ opacity: 1 }}
//         //         exit={{ opacity: 0 }}
//         //         transition={{ duration: 0.3 }}
//         //     >

//         //         {/* Modal */}
//         //         <motion.div
//         //             className="w-[90%] sm:w-[400px] rounded-2xl p-6
//         //                 bg-linear-to-br from-slate-800 via-purple-900 to-slate-900
//         //                 shadow-2xl border border-white/10"

//         //                 initial={{ opacity: 0, scale: 0.8, y: 40 }}
//         //                 animate={{ opacity: 1, scale: 1, y: 0 }}
//         //                 exit={{ opacity: 0, scale: 0.8, y: 40 }}
//         //                 transition={{
//         //                 type: "spring",
//         //                 stiffness: 120,
//         //                 damping: 15
//         //             }}
//         //         >

//         //             {/* Close */}
//         //             <div className="flex justify-end">
//         //                 <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
//         //                     <RxCross2
//         //                     onClick={() => setOpen(false)}
//         //                     className="cursor-pointer w-10 h-10"
//         //                     />
//         //                 </motion.div>
//         //             </div>

//         //             {/* Title */}
//         //             <h2 className="text-xl font-semibold text-white mb-4">
//         //                 Create Content
//         //             </h2>

//         //             {/* Inputs */}
//         //             <div className="flex flex-col gap-4">
//         //                 <motion.input
//         //                     ref={titleRef}
//         //                     whileFocus={{ scale: 1.03 }}
//         //                     type="text"
//         //                     placeholder="Title"
//         //                     className="px-4 py-2 rounded-lg bg-white/10 text-white outline-none focus:ring-2 focus:ring-purple-400"
//         //                 />

//         //                 <motion.input
//         //                     ref={linkRef}
//         //                     whileFocus={{ scale: 1.03 }}
//         //                     type="text"
//         //                     placeholder="Link"
//         //                     className="px-4 py-2 rounded-lg bg-white/10 text-white outline-none focus:ring-2 focus:ring-purple-400"
//         //                 />
//         //             </div>

//         //             {/* Type */}
//         //             <div className="mt-4">
//         //             <p className="text-gray-300 mb-2">Choose Type:</p>
//         //             <div className="flex gap-3">
//         //                 <motion.button
//         //                     onClick={()=>setType(ContentType["Youtube"])}
//         //                     whileTap={{ scale: 0.9 }}
//         //                     whileHover={{ scale: 1.1 }}
//         //                     className={`px-4 cursor-pointer py-1 flex items-center gap-2 rounded-full ${type === "youtube" ? "bg-blue-600" : "bg-sky-500"}`}
//         //                     >
//         //                     {type === "youtube" && <Check size={16}/>} Youtube
//         //                 </motion.button>

//         //                 <motion.button
//         //                     onClick={()=>setType(ContentType["Twitter"])}
//         //                     whileTap={{ scale: 0.9 }}
//         //                     whileHover={{ scale: 1.1 }}
//         //                     className={`px-4 cursor-pointer py-1 flex items-center gap-2 rounded-full ${type === "twitter" ? "bg-blue-600" : "bg-sky-500"}`}
//         //                     >
//         //                     {type === "twitter" && <Check size={16}/>} Twitter
//         //                 </motion.button>
//         //             </div>
//         //             </div>

//         //             {/* Submit */}
//         //             {
//         //                 loading
//         //                 ? <div className="py-6 w-full flex justify-center items-center">
//         //                     <div className="loader w-10 h-10"></div>
//         //                 </div>
//         //                 :  <motion.button
//         //                     onClick={submitHandler}
//         //                     whileTap={{ scale: 0.95 }}
//         //                     whileHover={{ scale: 1.03 }}
//         //                     className="mt-6 cursor-pointer w-full py-2 rounded-lg bg-linear-to-r from-purple-500 to-blue-500"
//         //                     >
//         //                     Submit
//         //                 </motion.button>
                            
//         //             }

//         //         </motion.div>
//         //     </motion.div>
//         // </AnimatePresence>

//         // <AnimatePresence>
//         //     <motion.div
//         //     initial={{ opacity: 0 }}
//         //     animate={{ opacity: 1 }}
//         //     exit={{ opacity: 0 }}
//         //     className={`fixed inset-0 ${open ? "block" : "hidden"} bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4`}
//         //     >
//         //     <motion.div
//         //         initial={{ scale: 0.9, opacity: 0 }}
//         //         animate={{ scale: 1, opacity: 1 }}
//         //         exit={{ scale: 0.9, opacity: 0 }}
//         //         className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-7 shadow-2xl"
//         //     >
//         //         <div className="flex items-center justify-between mb-6">
//         //         <div>
//         //             <h2 className="text-2xl font-semibold">Create Content</h2>
//         //             <p className="text-sm text-gray-400 mt-1">
//         //                 Start collaborating with your team.
//         //             </p>
//         //         </div>

//         //         <button
//         //             onClick={() => props.setOpen(false)}
//         //             className="text-gray-400 hover:text-white text-xl"
//         //         >
//         //             ×
//         //         </button>
//         //         </div>

//         //         <div className="space-y-5">
//         //         <div>
//         //             <label className="text-sm text-gray-400 block mb-2">
//         //                 Room Name
//         //             </label>

//         //             <input
//         //             ref={roomInput}
//         //             placeholder="Enter room name"
//         //             className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition"
//         //             />
//         //         </div>

//         //         <div>
//         //             <label className="text-sm text-gray-400 block mb-2">
//         //             Description
//         //             </label>

//         //             <textarea
//         //             rows={4}
//         //             placeholder="Write room description"
//         //             className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none resize-none focus:border-indigo-500 transition"
//         //             />
//         //         </div>

//         //         <Button
//         //             type="button"
//         //             disabled={active && true}
//         //             iconFirst={true}
//         //             icon={active ? <Loader size={20} className="animate-spin"/> : <ArrowRight size={20}/>}
//         //             text={active ? "Creating..." : "Create room"}
//         //             design="designedPrimary"
//         //             className={`w-full py-3 justify-center gap-2 rounded-2xl font-semibold ${active && "cursor-not-allowed"}`}
//         //             onClick={createRoomHandler}
//         //         />
//         //         </div>
//         //     </motion.div>
//         //     </motion.div>
//         // </AnimatePresence>

        
// //     )
// // }







import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  Plus, 
  FileText, 
  Cross, 
  Globe, 
  X, 
  Tag, 
  Link as LinkIcon, 
  Sparkles,
  Check
} from "lucide-react";

type ContentType = "youtube" | "twitter" | "notes" | "github" | "website";

interface ContentTypeConfig {
  id: ContentType;
  label: string;
  icon: React.ElementType;
  color: string;
  urlPlaceholder: string;
}

const CONTENT_TYPES: ContentTypeConfig[] = [
  { 
    id: "website", 
    label: "Website", 
    icon: Globe, 
    color: "from-blue-500 to-cyan-400",
    urlPlaceholder: "https://example.com/article" 
  },
  { 
    id: "youtube", 
    label: "YouTube", 
    icon: Video, 
    color: "from-red-500 to-rose-400",
    urlPlaceholder: "https://youtube.com/watch?v=..." 
  },
  { 
    id: "twitter", 
    label: "Twitter/X", 
    icon: Plus, 
    color: "from-sky-400 to-blue-500",
    urlPlaceholder: "https://x.com/username/status/..." 
  },
  { 
    id: "github", 
    label: "GitHub", 
    icon: Cross, 
    color: "from-purple-500 to-slate-400",
    urlPlaceholder: "https://github.com/owner/repo" 
  },
  { 
    id: "notes", 
    label: "Quick Note", 
    icon: FileText, 
    color: "from-amber-400 to-orange-500",
    urlPlaceholder: "" 
  },
];

const PRESET_TAGS = ["#dev", "#ai", "#design", "#ideas", "#research"];

export const CreateContent= ({open, setOpen}:{
    open : boolean,
    setOpen : (e:boolean)=>void
})=>{
  const [isOpen, setIsOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<ContentType>("website");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const activeConfig = CONTENT_TYPES.find((t) => t.id === selectedType)!;

  const handleAddTag = (tagToAdd: string) => {
    const formatted = tagToAdd.trim().startsWith("#") 
      ? tagToAdd.trim() 
      : `#${tagToAdd.trim()}`;
    if (formatted && !tags.includes(formatted)) {
      setTags([...tags, formatted]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsOpen(false);
      // Reset form
      setTitle("");
      setUrl("");
      setDescription("");
      setTags([]);
    }, 1200);
  };

  return (
    <div className=" bg-slate-950 flex items-center justify-center selection:bg-purple-500/30">

      {/* Modal Backdrop & Container */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Glassmorphism Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-8 shadow-2xl backdrop-blur-2xl backdrop-saturate-200"
            >
              {/* Background Ambient Glows */}
              <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

              {/* Header */}
              <div className="relative flex items-center justify-between pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 shadow-inner">
                    <Sparkles className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">
                      Secondary Brain
                    </h2>
                    <p className="text-xs text-slate-400">
                      Save links, thoughts, and resources to your vault
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="relative space-y-5">
                {/* Content Type Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Content Type
                  </label>
                  <div className="grid grid-cols-5 gap-2 rounded-2xl bg-slate-950/50 p-1.5 border border-white/5">
                    {CONTENT_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className="relative flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-medium transition-colors"
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 rounded-xl bg-white/10 border border-white/20 shadow-lg"
                              transition={{ type: "spring", duration: 0.5 }}
                            />
                          )}
                          <Icon
                            className={`h-4 w-4 z-10 transition-colors ${
                              isSelected ? "text-white" : "text-slate-400"
                            }`}
                          />
                          <span
                            className={`z-10 truncate w-full text-center text-[10px] sm:text-xs ${
                              isSelected ? "text-white font-semibold" : "text-slate-400"
                            }`}
                          >
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title..."
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                {/* URL Link Input (Hidden for Notes) */}
                <AnimatePresence mode="wait">
                  {selectedType !== "notes" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        URL Link <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <LinkIcon className="h-4 w-4" />
                        </div>
                        <input
                          type="url"
                          required
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder={activeConfig.urlPlaceholder}
                          className="w-full rounded-xl bg-slate-950/40 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tags Section */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Tags
                  </label>
                  
                  {/* Tag Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 border border-purple-500/30 text-purple-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-400 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Tag Input & Quick Pills */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag(tagInput);
                          }
                        }}
                        placeholder="Add tag and hit Enter..."
                        className="w-full rounded-xl bg-slate-950/40 border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  {/* Preset Tag Suggestions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {PRESET_TAGS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddTag(preset)}
                        className="text-[10px] text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 px-2 py-0.5 rounded-md transition-colors"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSaved}
                    className="relative overflow-hidden flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 border border-white/20 shadow-lg shadow-purple-500/20"
                  >
                    {isSaved ? (
                      <>
                        <Check className="h-4 w-4" />
                        Saved to Brain!
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Save Entry
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}