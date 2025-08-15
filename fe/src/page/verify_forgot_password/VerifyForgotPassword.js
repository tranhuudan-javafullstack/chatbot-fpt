import "./VerifyForgotPassword.scss";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {verifyForgotPassWord} from "../../services/UserService";
import {Routers} from "../../utils/Constants";

export default function VerifyForgotPassword({}) {
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const location = useLocation();
    const { email } = location.state || {};
    const [resendSuccess, setResendSuccess] = useState('');
    useEffect(()=> {
        setResendSuccess("Token verification send your email.")
        setTimeout(()=> setResendSuccess(""), 5000);
    }, []);
    const handleCancel = () => {
        navigate(-1)
    }
    const handleSendTokenToEmail = async () => {
        // navigate(Routers.ChangePassword, { state: { email: email, token: token}});
        await verifyForgotPassWord(email,token).then(data  =>{
            navigate(Routers.ChangePassword, { state: { email: email, token: data.token}});
        }).catch(error => {
            setError(error.message);
            return;
        });
    }
    return (
        <div className={"verify_account_page"}>
            <div className={"verify_account"}>
                <div className="verify_account--header">
                    <span className="title">Xác minh quên mật khẩu</span>
                </div>
                <div className="verify_account--body">
                    <input type="text" className="input_token" value={token} onChange={(e)=> {setToken(e.target.value)}} placeholder={"Nhập token"}/>
                </div>
                <div className="notification">
                    {error && <span className={"message_error"}>{error}</span>}
                    {resendSuccess && <span className="message_resend">{resendSuccess}</span>}
                </div>
                <div className="verify_account--footer">
                    <div onClick={handleCancel} className="footer_btn footer_btn--cancel"><span className="btn_title">Hủy</span></div>
                    <div onClick={handleSendTokenToEmail} className="footer_btn footer_btn--verify"><span className="btn_title">Xác thực</span></div>
                </div>
            </div>
        </div>
    )
}