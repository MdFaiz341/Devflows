// import { useStore } from "../Storage/useStore";
// import api from "./Interceptor"


// export const GetMe = async()=>{

//     const setUser = useStore((state)=>state.setUser);

//     try{
//         const response = await api.get("/profile");
//         console.log("res--", response);
//         setUser({
//             firstname:response.data.user.firstname,
//             lastname:response.data.user.lastname,
//             image:response.data.user.image,
//             email : response.data.user.email,
//             id:response.data.user.id
//         });
//     }
//     catch(e){
//         console.log("No user logged in");
//         console.log(e);
//     }
// }