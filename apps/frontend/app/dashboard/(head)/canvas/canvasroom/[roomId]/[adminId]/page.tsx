import { Canvas } from "../../../../../../../components/CanvasUI/Canvas";




export default async function CanvasRoom({params}:{
    params:{
        roomId : number,
        adminId: string,
    }
}){

    const url = (await params)
    const roomId = url.roomId;
    const adminId = url.adminId;

    console.log("[roomId]: ", roomId);
    console.log("[adminId]: ", adminId);

    return <Canvas roomId={roomId} adminId={adminId}/>
}