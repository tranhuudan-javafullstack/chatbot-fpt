const initialState = {
    chats: [],
    currentChat: null,
};
export default function chatsBotReducer(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_CHATS_BOT':
            return {
                ...state,
                chats: action.payload ? action.payload : [],
                // chats: action.payload ,
            };
        case 'ADD_CHATS_BOT':
            return {
                ...state,
                chats: {
                    ...state.chats,
                    chats: [...state.chats.chats, action.payload],
                }
            };
        case 'UPDATE_CHATS_BOT':
            return {
                ...state,
                chats: {
                    ...state.chats,
                    chats: state.chats.chats.map(chat =>
                        chat.chat_id === action.payload.chat_id ? { ...chat, ...action.payload } : chat
                    ),
                }
            };
        case 'DELETE_CHATS_BOT':
            return {
                ...state,
                chats: {
                    ...state.chats,
                    chats: state.chats.chats.filter(chat => chat.chat_id !== action.payload),
                }
            };
        case 'SAVE_CURRENT_CHAT_IN_BOT':
            return {
                ...state,
                currentChat: action.payload,
            };
        default:
            return state;
    }
}