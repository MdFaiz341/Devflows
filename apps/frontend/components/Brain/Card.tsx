
import { Trash2 } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { RiTwitterFill } from "react-icons/ri";
import { useEffect } from "react";
import { toast } from "sonner";
import api from "../../API/Interceptor";

interface CardProps{
    title:string,
    link:string,
    type: "youtube" | "twitter",
    createdAt:Date,
    id:string,
    contentHook:any
}

export const Card = (props:CardProps)=>{

    useEffect(() => {
        // const timeout = setTimeout(() => {
        //     if (window?.twttr.widgets) {
        //         window.twttr.widgets.load()
        //     }
        // }, 300)

        // return () => clearTimeout(timeout)
    }, [props.contentHook.content])


    async function delteHandler(id:string){
        const toastId = toast.loading("Deleting...")
        try{
            const response = await api.post("/deleteContent", {id});
            props.contentHook.getContentApi();
            toast.success(response.data.message);
        }
        catch(e:any){
            toast.error(e.response.data.message || "Failed");
        } finally{
            toast.dismiss(toastId);
        }
    }

    return (
        <div className="dark:bg-gray-800 backdrop-blur-2xl break-inside-avoid mb-4 w-full  bg-white p-4 flex flex-col gap-3 rounded-2xl shadow-lg hover:shadow-purple-500 transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="font-semibold text-xl dark:text-white">{props.title}</div>
                {
                    props.type == "youtube"
                    ? <FaYoutube className="w-5 h-5 dark:text-green-400"/>
                    : <RiTwitterFill className="w-5 h-5 dark:text-green-400"/>
                }
            </div>
            <div>
                {
                    props.type == "youtube"
                    ? <div className="w-full overflow-hidden rounded-xl">
                        <iframe className="w-full aspect-video" src={props.link.replace("watch?v=", "embed/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </div>
                    : <div className="object-contain overflow-hidden">
                        <blockquote className="twitter-tweet">
                            <a href={props.link.replace("x", "twitter")} target="_blank"></a>
                        </blockquote> <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
                    </div>
                }
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center font-semibold dark:text-green-400">
                    <span>Date : </span>
                    {new Date(props.createdAt).toLocaleDateString()}
                </div>
                <Trash2 onClick={()=>delteHandler(props.id)} size={20} className="text-violet-600 cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out"/>
            </div>
        </div>
    )
}