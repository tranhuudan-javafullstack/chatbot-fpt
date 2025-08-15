export function loginSuccess(accessToken, refreshToken) {
    return {
        type: 'LOGIN_SUCCESS',
        payload: {
            accessToken,
            refreshToken
        },
    };
}
export function saveUserInfo(data) {
    return {
        type: 'SAVE_USER_INFO',
        payload: {
            "userId": data.user_id,
            "username": data.username,
            "email": data.email,
            "firstName": data.first_name,
            "lastName": data.last_name,
            "role": data.role,
            "gender": data.gender,
            "avatar": data.avatar,
            "birtDate": data.birth_date,
        },
    };
}
