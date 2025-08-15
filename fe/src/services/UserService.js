import {ApiConstants} from "../utils/Constants";

export const signup = async (password, email) => {
    try {
        const res = await fetch(ApiConstants.signup, {
            method: "POST",
            headers: {
                // authorization: `${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "password": password,
                "email": email,
            },)
        });
        const data = await res.json();
        if(!res.ok){
            if(res.status === 422) throw new Error(`${data.detail[0].msg}`);
            throw new Error(`${data.detail}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const login = async (userName, password) => {
    try {
        const res = await fetch(ApiConstants.login, {
            method: "POST",
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: 'password',
                username: userName,
                password: password,
                scope: '',
                client_id: 'string',
                client_secret: 'string'
            })
        });
        const data = await res.json();
        data.status = res.status;
        if(res.status === 403){
            return data;
        }
        if(!res.ok){
            throw new Error(`${data.detail}`);
        }else{
            return data
        }
    }catch (error) {
        throw error;
    }
}
export const resendVerifyToken = async (email) => {
    try {
        const res = await fetch(ApiConstants.resendVerifyToken, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email
            },)
        });
        const data = await res.json();
        if(!res.ok){
            throw new Error(`${data.detail[0].msg}`);
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const verifyAccount = async (email, token) => {
    try {
        const res = await fetch(`${ApiConstants.verifyToken}?email=${email}&token=${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
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
export const logout = async (authToken) => {
    try {
        const res = await fetch(`${ApiConstants.logout}`, {
            method: "POST",
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
export const getUserInfo = async (accessToken) => {
    try {
        const res = await fetch(ApiConstants.getUserInfo, {
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
export const getBots = async (accessToken) => {
    try {
        const res = await fetch(ApiConstants.getBots, {
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
export const verifyToken = async (accessToken) => {
    try {
        const res = await fetch(ApiConstants.authVerifyToken, {
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
            return true;
        }
    }catch (error) {
        throw error;
    }
}

export const updateInfo = async (firstName, lastName, gender, birthDate, accessToken) => {
    try {
        const res = await fetch(ApiConstants.updateUser, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify({
                "first_name": firstName,
                "last_name": lastName,
                "gender": gender,
                "birth_date": birthDate,
            },)
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
export const changePassword = async ( password, oldPassword,accessToken, refreshToken) => {
    try {
        const res = await fetch(ApiConstants.updatePassword, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify({
                "password": password,
                "old_password": oldPassword,
                "is_logout": false,
                "refresh_token": refreshToken,
            },)
        });
        const data = await res.json();
        if(!res.ok){
            if(res.status === 422){
                throw new Error(`${data.detail[0].msg}`);
            }else{
                throw new Error(`${data.detail}`);
            }
        }else{
            return data;
        }
    }catch (error) {
        throw error;
    }
}
export const forgotPassWord = async (email) => {
    try {
        const res = await fetch(`${ApiConstants.forgotPass}?email=${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(!res.ok){
            const data = await res.json();
            throw new Error(`${data.detail}`);
        }else{
            return res.text();
        }
    }catch (error) {
        throw error;
    }
}
export const verifyForgotPassWord = async (email, token) => {
    try {
        const res = await fetch(`${ApiConstants.verifyForgotPass}?email=${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "token": token,
            },)
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
export const acceptChangePassword = async (email, password,session) => {
    try {
        const res = await fetch(`${ApiConstants.acceptForgotPass}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "password": password,
                "session": session,
                "email": email,
            },)
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
export const refreshToken = async () => {
    // try {
    //     const res = await fetch(ApiConstants.getBots, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             authorization: `Bearer ${accessToken}`,
    //         },
    //     });
    //     const data = await res.json();
    //     if(!res.ok){
    //         throw new Error(`${data.detail}`);
    //     }else{
    //         return data;
    //     }
    // }catch (error) {
    //     throw error;
    // }
}
