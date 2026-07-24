// "use client"


// import { useRouter } from "next/navigation";


// type RouteURL = Record<string, string>

// const subUrl : RouteURL = {
//     "Canvas Rooms" : "canvas",
//     "Dashboard" : "/",
//     "Chat Rooms" : "chat-room",
//     "Second Brain" : "brain",
//     "Settings" : "profile",
// }


// export function SidebarButton({
//   icon: Icon,
//   label,
//   active,
// }: {
//   icon: React.ElementType;
//   label: string;
//   active: boolean;
// }) {

//     const router = useRouter();

//     function clickHandler(url:string){
//         router.push(`dashboard/${subUrl[url]}`);
//     }

//   return (
//     <button
//       onClick={()=>clickHandler(label)}
//       type="button"
//       className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 will-change-transform ${
//         active
//           ? "bg-gradient-to-r from-orange-500/40 to-pink-500/20 text-white shadow-[0_0_30px_rgba(255,120,80,0.15)]"
//           : "text-zinc-400 hover:bg-white/[0.03] hover:text-white"
//       }`}
//     >
//       <Icon className="h-5 w-5" />
//       <span className="font-medium">{label}</span>
//     </button>
//   );
// }