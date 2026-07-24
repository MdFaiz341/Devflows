import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const FormatMessageTime = (date : string)=>{
    const d = dayjs(date);

    if(d.isToday()){
        return d.format("hh:mm A");
    }
    if(d.isYesterday()){
        return "Yesterday";
    }

    return d.format("DD MMM YYYY");
}


export const FormatChatDate = (date : string)=>{
    const d = dayjs(date);

    if (d.isToday()) {
        return "Today";
    }

    if (d.isYesterday()) {
        return "Yesterday";
    }

    return d.format("DD MMM YYYY");
}