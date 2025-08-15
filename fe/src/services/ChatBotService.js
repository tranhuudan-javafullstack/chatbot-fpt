import {ApiConstants} from "../utils/Constants";

export const getChatsBot = async (accessToken, botId) => {
    try {
        const res = await fetch(`${ApiConstants.chatsBot}/${botId}/chats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const getChatsInBot = async (accessToken, botId, chatId) => {
    try {
        const res = await fetch(`${ApiConstants.chatsBot}/${botId}/chats/${chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const createChatBot = async (title, authToken, botId) => {
    try {
        const res = await fetch(`${ApiConstants.chatsBot}/${botId}/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                "title": title,
            })
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const updateChatBot = async (title, authToken, botId, chatId) => {
    try {
        const res = await fetch(`${ApiConstants.chatsBot}/${botId}/chats/${chatId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                "title": title,
            })
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const deleteChatBot = async (authToken, botId, chatId) => {
    try {
        const res = await fetch(`${ApiConstants.chatsBot}/${botId}/chats/${chatId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
// queries
export const createQueryBot = async (botId, chatId,message, authToken) => {
    try {
        const res = await fetch(`${ApiConstants.chatQueries}/${botId}/chats/${chatId}/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                "query": message,
            })
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
// knowledges
export const getKnowledgeInBot = async (accessToken, botId) => {
    try {
        const res = await fetch(`${ApiConstants.knowledgeBot}/${botId}/knowledges`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const addKnowledgeToBot = async (botId, knowledgeId, authToken) => {
    try {
        const res = await fetch(`${ApiConstants.knowledgeBot}/${botId}/knowledges`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                "knowledge_id": knowledgeId,
            })
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const deleteKnowledgeToBot = async (botId, knowledgeId, authToken) => {
    try {
        const res = await fetch(`${ApiConstants.knowledgeBot}/${botId}/knowledges/${knowledgeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
        });
        if(res.status != 204){
            throw new Error(`ERROR`);
        }else{
            return "SUCCESSFUL";
        }
    }catch (error) {
        throw error;
    }
}


