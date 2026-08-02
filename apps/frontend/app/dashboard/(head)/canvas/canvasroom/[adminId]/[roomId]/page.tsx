import { Canvas } from "../../../../../../../components/CanvasUI/Canvas"





export default async function canvasRoom({params}:{
    params : {
        adminId : string,
        roomId : number,
    }
}){

    const url = (await params);
    const roomId = url.roomId
    console.log("roomId: ", roomId);
    const adminId = url.adminId
    console.log("adminId: ", adminId);

    return <Canvas roomId={roomId} adminId={adminId}/>
}