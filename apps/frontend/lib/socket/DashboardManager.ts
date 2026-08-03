
import api from "../../API/Interceptor";
import { useChatStore } from "../../Storage/useChatStore";
import { useStore } from "../../Storage/useStore";
import { chatManager } from "./ChatManager";



class DashboardManager {

    private static instance: DashboardManager;

    private initialized = false;

    static getInstance() {

        if (!DashboardManager.instance) {

            DashboardManager.instance =
                new DashboardManager();

        }

        return DashboardManager.instance;

    }

    private constructor() {}



    async initialize() {

        if (this.initialized) return;

        this.initialized = true;

        try {
            await this.fetchConversations();

            chatManager.start();
            console.log("ChatManager Start---");
        }
        catch (err) {
            console.error(err);
        }

    }

    destroy() {
        if (!this.initialized) return;
        this.initialized = false;
        chatManager.stop();
        console.log("ChatManager Stop-----");
    }


    private async fetchConversations(){
        try{
                const response = await api.get("/conversations");
                console.log("allchatsWithRoom: ", response.data.conversation);
                const user = useStore.getState().user;
                const chatStore = useChatStore.getState();

                chatStore.setBackendConversation(response.data.conversation)

                const val = response.data.conversation.map((v:any)=> v.id)
                chatStore.setSideConversationOrder(val);

                response.data.conversation.forEach((v:any)=> {
                    const friendDetails = v.members.filter((users:any) => users.userId !== user?.id);
                    const data = {
                        conversationId : v.id,
                        createdAt : v.createdAt,
                        image : v.image || null,
                        // member : {
                        //     senderId : friendDetails[0].userId,
                        //     firstname : friendDetails[0].user.firstname,
                        //     image : friendDetails[0].user.image,
                        // },
                        member : friendDetails,
                        lastMessage : v.messages.length > 0 ? v.messages[0].text.includes("joined") ? "" : v.messages[0].text : "",
                        type : v.type,
                        name : v.name || null,
                        updatedAt : v.updatedAt,
                    } 
                    chatStore.setSidebarDefaultConversation(v.id, data);

                    //set default unread Messages:
                    const currUser = v.members.find((admin:any)=>admin.userId === user?.id)
                    // console.log("msg-members", v.members.find((val:any)=>val.userId === user?.id))
                    if(currUser.unreadCount > 0){
                        chatStore.setUnreadMessage(currUser.conversationId, currUser.unreadCount);
                    }
                })

                // setConversation(response.data.conversation);
            }
            catch(e:any){
                console.log(e);
            }
    }

}

export const dashboardManager =
    DashboardManager.getInstance();