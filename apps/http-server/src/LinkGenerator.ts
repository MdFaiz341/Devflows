


export const LinkGenerator = async()=>{
    const val = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let randomString = "";
    for(let i=0; i<30; i++){
        const index = Math.floor(Math.random() * val.length);
        randomString += val[index];
    }
    return randomString;
}