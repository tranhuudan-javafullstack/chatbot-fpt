export function saveChatsBot(chats) {
    return {
        type: 'SAVE_CHATS_BOT',
        payload: chats,
    };
}
export function addChat(chat) {
    return {
        type: 'ADD_CHATS_BOT',
        payload: chat,
    };
}
export function actionUpdateChat(chat) {
    return {
        type: 'UPDATE_CHATS_BOT',
        payload: chat,
    };
}
export function actionDeleteChat(chatId) {
    return {
        type: 'DELETE_CHATS_BOT',
        payload: chatId,
    };
}
export function actionSaveCurrentChatInBot(chat) {
    return {
        type: 'SAVE_CURRENT_CHAT_IN_BOT',
        payload: chat,
    };
}
// export function actionSaveKnowledgeInBot(knowledge) {
//     return {
//         type: 'SAVE_KNOWLEDGE_IN_CURRENT_CHAT_BOT',
//         payload: knowledge,
//     };
// }