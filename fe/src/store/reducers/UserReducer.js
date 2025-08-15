
const initialState = {
    username: '',
    accessToken: '',
    refreshToken: '',
    userId: '',
    email: "",
    firstName: "",
    lastName: "",
    birtDate: "",
    role: "",
    gender: "",
    avatar: "",
    chats: [],
    chatsRoom: [],
    chatsPeople: [],
    currentChat: null,
    images: [],
    avatarPeople: [],
    avatarGroups: [],
    nickNameGroups: [],
    nickNamePeople: [],
};
export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            };
        case 'SAVE_USER_INFO':
            return {
                ...state,
                userId: action.payload.userId,
                username: action.payload.username,
                email: action.payload.email,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                role: action.payload.role,
                gender: action.payload.gender,
                avatar: action.payload.avatar,
                birtDate: action.payload.birtDate,
            }
        // case 'SAVE_LIST_CHATS':
        //     return {
        //         ...state,
        //         chats: action.payload,
        //     }
        // case 'CHANGE_CURRENT_CHAT':
        //     let nameChat = action.payload.nameChat;
        //     let type = action.payload.type;
        //     let currentChatChoose = null;
        //     if(type == 1){
        //         const room= state.chatsRoom.find(room => room.name === nameChat);
        //         currentChatChoose = room;
        //         console.log(room+"HELLO")
        //     }
        //     if(type == 0){
        //         const people= state.chatsPeople.find(people => people.name === nameChat);
        //         if(people){
        //             currentChatChoose = people;
        //         }
        //     }
        //     return {
        //         ...state,
        //         currentChat: currentChatChoose,
        //     }
        // case 'UPDATE_CHATS':
        //     // let isExist = false;
        //     const updateChats = state.chatsRoom.map((room,index) => {
        //         if(room.name === action.payload.name){
        //             // isExist = true;
        //             return action.payload;
        //         }
        //         return room;
        //     });
        //     // if(!isExist) updateChats.push(action.payload);
        //     return {
        //         ...state,
        //         chatsRoom: updateChats,
        //         currentChat: action.payload,
        //     }
        // case 'CLEAR_CURRENT_CHAT': {
        //     return {
        //         ...state,
        //         currentChat: null,
        //     }
        // }
        // case 'LOGOUT_SUCCESS':
        //     return initialState;
        default:
            return state;
    }
}