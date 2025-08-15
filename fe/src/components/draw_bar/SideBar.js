import './SideBar.scss'
import SideBarItem from "../draw_bar_item/SideBarItem";
import {useState} from "react";
import BotModal from "../bot_modal/BotModal";
import {ReactComponent as BotIcon} from "../../assets/svg/bot.svg";
import {logout} from "../../services/UserService";
import {useNavigate} from "react-router-dom";
import {Routers} from "../../utils/Constants";
import {decryptToken} from "../../utils/Functions";

export default function SideBar(props) {
    const [createBotModal, setCreateBotModal] = useState(false);
    const [titleBot, setTitleBot] = useState("");
    const [descriptionBot, setDescriptionBot] = useState("");
    const [index, setIndex] = useState('0');
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    const navigate = useNavigate();
    const toggleCreateBotModel = () => {
        setCreateBotModal(!createBotModal);
    }
    const confirm = (titleBot, descriptionBot) => {
        console.log(descriptionBot);
    }
    const handleLogout = async () => {
        await logout(accessToken).then(data => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate(Routers.Login);
        }).catch(error => {
            return;
        })
    }
    const navigateToMyInfo = () => {
        // navigate("myInfo");
        // console.log("DAY NEFFFFF")
    }
    return(
        <div className={"drawbar"}>
            <div className={"drawbar__header"}>
                {/*<TextButtonIcon icon={<i className="bi bi-plus-lg"></i>} title={"Create bot"} onPress={toggleCreateBotModel}/>*/}
                <SideBarItem icon={<BotIcon/>} title={"Bots"} url={"/bots"} index={1} selectedIndex={index} handleSelect={setIndex}/>
                <SideBarItem icon={<i className="bi bi-journal-text"></i>} title={"Kiến thức"} url={"/knowledge"} index={2} selectedIndex={index} handleSelect={setIndex}/>
            </div>
            <div className={"drawbar__bottom"}>
                <SideBarItem handleSelect={setIndex} index={3} selectedIndex={index} url={Routers.MyInfo} icon={<i className="bi bi-person"></i>} title={"Tài khoản"}/>
                <SideBarItem handleSelect={handleLogout} index={4} selectedIndex={index} icon={<i className="bi bi-box-arrow-right"></i>} title={"Đăng xuất"}/>
            </div>
            {
                createBotModal && <BotModal toggleCreateBotModel={toggleCreateBotModel} confirm={confirm}/>
            }
        </div>
    )
}