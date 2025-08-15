import {ApiConstants} from "../utils/Constants";

export const createBot = async (name, description, authToken) => {
    try {
        const res = await fetch(ApiConstants.bots, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                "name": name,
                "description": description,
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
export const updateBot = async (botId,name, description, authToken) => {
    try {
        const res = await fetch(`${ApiConstants.bots}/${botId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                "name": name,
                "description": description,
                // "prompt": "string",
                // "active": true,
                // "memory": true
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
export const deleteBot = async (botId, authToken) => {
    try {
        const res = await fetch(`${ApiConstants.bots}/${botId}`, {
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