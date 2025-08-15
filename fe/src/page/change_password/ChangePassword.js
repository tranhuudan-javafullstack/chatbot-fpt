import "./ChangePassword.scss";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {acceptChangePassword} from "../../services/UserService";
import {Routers} from "../../utils/Constants";
import Loading from "../../components/loading/Loading";
import successful from "../../assets/images/check.png";

export default function ChangePassword({}) {
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const location = useLocation();
    const { email, token } = location.state || {};
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessFul, setIsSuccessFul] = useState(false);
    console.log("TOKEN", token);
    useEffect(()=> {
    }, []);
    const handleCancel = () => {
        navigate(-1)
    }
    const handleChangePassWord = async () => {
        setIsLoading(true);
        await acceptChangePassword(email, password,token).then(data  =>{
            setIsLoading(false);
            setIsSuccessFul(true);
        }).catch(error => {
            setError(error.message);
            setIsLoading(false);
            return;
        });
    }
    const handleReturnLogin = () => {
        navigate(Routers.Login);
    }
    return (
        <>
            {isLoading ? <Loading/> : <>
                 <div className={"verify_account_page"}>
                    <div className={"verify_account"}>
                        {isSuccessFul ?  <>
                            <div className="success_img">
                                <img src={successful} alt=""/>
                            </div>
                            <p className={"noti_message"}>Mật khẩu thay đổi thành công</p>
                            <div onClick={handleReturnLogin} className="btn_return_login">
                                <span>Login</span>
                            </div>
                        </> : <>
                            <div className="verify_account--header">
                                <span className="title">Thay đổi mật khẩu</span>
                            </div>
                            <div className="verify_account--body mb_10">
                                <input type="password" className="input_token" value={password} onChange={(e)=> {setPassword(e.target.value)}} placeholder={"Nhập mật khẩu mới"}/>
                            </div>
                            <div className="verify_account--body">
                                <input type="password" className="input_token" value={rePassword} onChange={(e)=> {setRePassword(e.target.value)}} placeholder={"Nhập lại mật khẩu"}/>
                            </div>
                            <div className="notification">
                                {error && <span className={"message_error"}>{error}</span>}
                            </div>
                            <div className="verify_account--footer">
                                <div onClick={handleCancel} className="footer_btn footer_btn--cancel"><span className="btn_title">Hủy</span></div>
                                <div onClick={handleChangePassWord} className="footer_btn footer_btn--verify"><span className="btn_title">Ok</span></div>
                            </div>
                        </>}
                    </div>
                </div>
            </>}
        </>
    )
}