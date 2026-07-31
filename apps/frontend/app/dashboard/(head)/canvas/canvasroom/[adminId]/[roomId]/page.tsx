import { Canvas } from "../../../../../../../components/CanvasUI/Canvas"





export default async function canvasRoom({params}:{
    params : {
        adminId : string,
        roomId : number,
    }
}){

    
    const roomId = params.roomId
    console.log("roomId: ", roomId);
    const adminId = params.adminId
    console.log("adminId: ", adminId);

    return <Canvas roomId={roomId} adminId={adminId}/>
}