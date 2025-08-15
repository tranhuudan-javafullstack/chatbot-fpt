import "./ForgotPassword.scss";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {forgotPassWord} from "../../services/UserService";
import {Routers} from "../../utils/Constants";

export default function ForgotPassword({}) {
    const [email, setEmail] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    useEffect(()=> {
    }, []);
    const handleCancel = () => {
        navigate(-1)
    }
    const handleSendTokenToEmail = async () => {
        await forgotPassWord(email).then(data  =>{
            navigate(Routers.VerifyForgotPass, { state: { email: email}});
        }).catch(error => {
            setError(error.message);
            return;
        });
    }
    return (
        <div className={"verify_account_page"}>
            <div className={"verify_account"}>
                <div className="verify_account--header">
                    <span className="title">Quên mật khẩu</span>
                </div>
                <div className="verify_account--body">
                    <input type="text" className="input_token" value={email} onChange={(e)=> {setEmail(e.target.value)}} placeholder={"Email"}/>
                </div>
                <div className="notification">
                    {error && <span className={"message_error"}>{error}</span>}
                </div>
                <div className="verify_account--footer">
                    <div onClick={handleCancel} className="footer_btn footer_btn--cancel"><span className="btn_title">Hủy</span></div>
                    <div onClick={handleSendTokenToEmail} className="footer_btn footer_btn--verify"><span className="btn_title">Gửi token</span></div>
                </div>
            </div>
        </div>
    )
}