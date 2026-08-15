import { Canvas } from "../../../../../../../components/CanvasUI/Canvas"





export default async function canvasRoom({params}:{
    params : {
        adminId : string,
        roomId : number,
    }
}){

    const url = (await params);
    const roomId = url.roomId
    const adminId = url.adminId

    return <Canvas roomId={roomId} adminId={adminId}/>
}