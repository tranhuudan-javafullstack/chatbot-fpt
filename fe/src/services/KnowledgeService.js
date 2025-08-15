import {ApiConstants} from "../utils/Constants";

export const getKnowledges = async (accessToken) => {
    try {
        const res = await fetch(`http://localhost:8068/api/v1/users/knowledges`, {
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
export const createKnowledge = async (name, description, authToken) => {
    try {
        const res = await fetch(ApiConstants.knowledges, {
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
export const updateKnowledge = async (knowledgeId,name, description, authToken) => {
    try {
        const res = await fetch(`${ApiConstants.knowledges}/${knowledgeId}`, {
            method: "PUT",
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
export const deleteKnowledge = async (knowledgeId, authToken) => {
    try {
        const res = await fetch(`${ApiConstants.knowledges}/${knowledgeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authToken}`,
            },
        });
        // const data = await res.json();
        if(res.status !== 204){
            throw new Error(`ERROR`);
        }else{
            return "SUCCESSFUL";
        }
    }catch (error) {
        throw error;
    }
}
export const addFileToKnowledge = async (files,knowledgeId, accessToken) => {
    try {
        const formData = new FormData();
        Array.from(files).forEach((file, index) => {
            formData.append('files', file);
        });
        const res = await fetch(`${ApiConstants.knowledges}/${knowledgeId}/files`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });
        if (res.status !== 201) {
            throw new Error(`ERROR`);
        } else {
            return "SUCCESSFUL";
        }
    } catch (error) {
        throw error;
    }
}
export const deleteFileFromKnowledge = async (fileId,knowledgeId, accessToken) => {
    try {
        const res = await fetch(`${ApiConstants.knowledges}/${knowledgeId}/files/${fileId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        if(res.status === 422){
            const data = await res.json();
            throw new Error(`${data.detail[0].msg}`);
        }
        if(res.status != 204){
            throw new Error(`ERROR`);
        }else{
            return "SUCCESSFUL";
        }
    }catch (error) {
        throw error;
    }
}
export const getFilesKnowledge = async (accessToken, knowledgeId) => {
    try {
        const res = await fetch(`${ApiConstants.knowledges}/${knowledgeId}`, {
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
export const getDetailFilesKnowledge = async (accessToken, knowledgeId, fileId) => {
    try {
        const res = await fetch(`${ApiConstants.knowledges}/${knowledgeId}/files/${fileId}`, {
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