import "./MyInfo.scss"
import {useDispatch, useSelector} from "react-redux";
import InputModal from "../input_modal/InputModal";
import {useEffect, useState} from "react";
import TextButtonIcon from "../icon_text_button/TextButtonIcon";
import {changePassword, updateInfo} from "../../services/UserService";
import {saveUserInfo} from "../../store/actions/UserAction";
import {decryptToken} from "../../utils/Functions";

export default function MyInfo() {
    const accessToken = decryptToken(localStorage.getItem('access_token') ?? "");
    const refreshToken = decryptToken(localStorage.getItem('refresh_token') ?? "");
    const userReducer = useSelector((state) => state.userReducer);
    const [gender, setGender] = useState(userReducer.gender);
    const [userName, setUserName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [birthDate, setBirthDate] = useState(userReducer.birtDate ? userReducer.birtDate.split('T')[0] : "");
    const [firstName, setFirstName] = useState(userReducer.firstName);
    const [lastName, setLastName] = useState(userReducer.lastName);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    useEffect(() => {
        // if (userReducer.username) {
        //     setUserName(userReducer.username);
        // }
        if(userReducer.avatar){
            setAvatar(userReducer.avatar);
        }
        // if(userReducer.gender) setGender(userReducer.gender);
        // if (userReducer.birth_date) setBirthDate(userReducer.birth_date);
    }, [userReducer]);
    const handleChange = (event) => {
        setGender(event.target.value);
    };
    const handleUpdateUser = async () => {
        try {
            // const birthDateISO = new Date(birthDate).toISOString();
            const userInfo = await updateInfo(firstName, lastName, gender, birthDate, accessToken);
            dispatch(saveUserInfo(userInfo));
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }
    const handleChangePassword = async () => {
        console.log("DO DAY")
        setError("");
        if(oldPassword == "" || newPassword == ""){
            setError("Do not enter current password or new password");
            return;
        }
        if(oldPassword === newPassword){
            setError("The new password and old password must not be the same");
            return;
        }
        try {
            const user = await changePassword(newPassword, oldPassword, accessToken, refreshToken)
        } catch (error) {
            setError(error.message);
            console.error('Error change password:', error);
        }
    }
    return (
        <div className={"my_account"}>
            <div className="bot_page__header">
                <div className="bot_page__title">
                    {/*<img src={knowledgeImage} alt=""/>*/}
                    <p className={"title"}>Tài khoản</p>
                </div>
            </div>
            <div className="bot_page__body my_info--body">
                <div className="body__header">
                    <div className="avatar">
                        <img src={avatar} alt=""/>
                        <div className="btn_edit_avatar">
                            <i className="bi bi-pencil-fill"></i>
                        </div>
                    </div>
                </div>
                <div className="body__content">
                    <div className="form_input">
                        <span className={"title_form"}>Thông tin người dùng</span>
                        <InputModal value={firstName ? firstName : ""} onChangeInput={setFirstName} label={"First name"} placeHolder={"Enter your first name"}/>
                        <InputModal value={lastName ? lastName : ""} onChangeInput={setLastName} label={"Last name"} placeHolder={"Enter your last name"}/>
                        <div className="form_footer">
                            <label htmlFor="date">Ngày sinh: </label>
                            <input id="date" onChange={(e)=> setBirthDate(e.target.value)} value={birthDate} type="date"/>
                            <label htmlFor="gender">Giới tính:</label>
                            <select id="gender" value={gender} onChange={handleChange}>
                                {/*<option value="option">Choose gender</option>*/}
                                <option value="male">nam</option>
                                <option value="female">nu</option>
                            </select>
                        </div>
                        <TextButtonIcon onPress={handleUpdateUser} title={"Cập nhật"} />
                    </div>
                    <div className="form_input">
                        <span className={"title_form"}>Thay đổi mật khẩu</span>
                        <InputModal type={"password"} value={oldPassword} onChangeInput={setOldPassword} label={"Mật khẩu hiện tại"} placeHolder={"Nhập mật khẩu hiện tại"}/>
                        <InputModal type={"password"} value={newPassword} onChangeInput={setNewPassword} label={"Mật khẩu mới"} placeHolder={"Nhập mật khẩu mới"}/>
                        <p className="error">{error}</p>
                        <TextButtonIcon onPress={handleChangePassword} title={"cập nhật"} />
                    </div>
                </div>
            </div>
        </div>
    )
}