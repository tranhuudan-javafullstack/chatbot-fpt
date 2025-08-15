import "./VerifyAccount.scss";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {resendVerifyToken, verifyAccount} from "../../services/UserService";
import {Routers} from "../../utils/Constants";

export default function VerifyAccount({}) {
    const [token, setToken] = useState("");
    const location = useLocation();
    const { email } = location.state || {};
    const navigate = useNavigate();
    const [resendSuccess, setResendSuccess] = useState('');
    const [error, setError] = useState('');
    useEffect(()=> {
        setResendSuccess("Token verification send your email.")
        setTimeout(()=> setResendSuccess(""), 5000);
    }, []);
    const handleCancel = () => {
        navigate(-1)
    }
    const handleResendToken = async () => {
        await resendVerifyToken(email).then(data  =>{
            setResendSuccess(data.message);
            setError("");
            setTimeout(() => {
                setResendSuccess("");
            }, 2000);
        }).catch(error => {
            setError(error.message);
            setResendSuccess("");
            return;
        });
    }
    const handleVerifyAccount = async () => {
        await verifyAccount(email, token).then(data  =>{
            navigate(Routers.Login);
        }).catch(error => {
            setError(error.message);
            setResendSuccess("");
            return;
        });
    }
    return (
        <div className={"verify_account_page"}>
            <div className={"verify_account"}>
                <div className="verify_account--header">
                    <span className="title">Verify account</span>
                </div>
                <div className="verify_account--body">
                    <input type="text" className="input_token" value={token} onChange={(e)=> {setToken(e.target.value)}} placeholder={"Enter verification token"}/>
                    <div onClick={handleResendToken} className="btn_resent"><span className="btn_title">Resend token</span></div>
                </div>
                <div className="notification">
                    {error && <span className={"message_error"}>{error}</span>}
                    {resendSuccess && <span className="message_resend">{resendSuccess}</span>}
                </div>
                <div className="verify_account--footer">
                    <div onClick={handleCancel} className="footer_btn footer_btn--cancel"><span className="btn_title">Cancel</span></div>
                    <div onClick={handleVerifyAccount} className="footer_btn footer_btn--verify"><span className="btn_title">Verify</span></div>
                </div>
            </div>
        </div>
    )
}