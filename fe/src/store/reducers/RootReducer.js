import {combineReducers} from "@reduxjs/toolkit";
import userReducer from "./UserReducer";
import botsReducer from "./BotsReducer";
import knowledgesReducer from "./KnowledgeReducer";
import chatsBotReducer from "./ChatReducer";

const rootReducer = combineReducers({
    userReducer: userReducer,
    botReducer: botsReducer,
    knowledgeReducer: knowledgesReducer,
    chatsBotReducer: chatsBotReducer,
});
export default rootReducer;