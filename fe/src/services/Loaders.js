import {getUserInfo} from "./UserService";
import {saveUserInfo} from "../store/actions/UserAction";

export const infoUserLoader = (dispatch, accessToken) => async ({params}) => {
    const userInfo = await getUserInfo(accessToken);
    dispatch(saveUserInfo(userInfo));
    return {userInfo};
}