import api from "../../../API/Interceptor"


export const GetAllShapes = async(roomId:number, page:number)=>{
    const response = await api.get(`/getShapesAtpage/${roomId}/${page}`);
    return response.data.shapes;
}