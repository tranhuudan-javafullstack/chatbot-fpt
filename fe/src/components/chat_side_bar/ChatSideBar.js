import "./ChatSideBar.scss";
import ChatSideBarItem from "../chat_side_bar_item/ChatSideBarItem";
import {useState} from "react";
import {createChatBot} from "../../services/ChatBotService";
import {decryptToken} from "../../utils/Functions";
import {addChat} from "../../store/actions/ChatAction";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import sidebar from "../../assets/icons/sidebar.png";

export default function ChatSideBar({botId}) {
    const [index, setIndex] = useState(-1);
    const [newChat, setNewChat] = useState("");
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const chatsBot = useSelector((state) => state.chatsBotReducer.chats);
    const chats = chatsBot ? chatsBot.chats :[];
    const [showSideBar, setShowSideBar] = useState(true);
    const handleCreateNewChat = async () =>{
        try {
            const data = await createChatBot(newChat,accessToken, botId);
            dispatch(addChat(data));
            setNewChat("");
        } catch (error) {
            console.error('Error create bot:', error.message);
        }
    }
    const handleShowSideBar = () => {
        setShowSideBar(!showSideBar);
    }
    return (
        <>
            <div onClick={handleShowSideBar} className={`btn_side_bar ${showSideBar ? "" :"btn_side_bar--transform"} `}>
                <img src={sidebar} alt=""/>
            </div>
            <div className={`drawbar side_bar ${showSideBar ? "" : "side_bar--hidden"}`}>
                <div className="drawbar--padding">
                    <div className="new_chat">
                        <input type="text" value={newChat} onChange={(e)=>setNewChat(e.target.value)} className={"new_chat__input"} placeholder={"Nhập tên đoạn chat"}/>
                        <div onClick={handleCreateNewChat} className="btn_create_chat"><span>Tạo chat</span></div>
                    </div>
                    <div className="chat__wrapper">
                        {chats.map((chatBot, i)=>{
                            return <ChatSideBarItem key={chatBot.chat_id} title={chatBot.title} botId={botId} chatId={chatBot.chat_id} index={i} selectedIndex={index} handleSelected={setIndex}/>
                        })}
                    </div>
                    <div onClick={()=>navigate("/")} className="btn_return_home">
                        <i className="bi bi-arrow-left"></i>
                        <span>Trang chủ</span>
                    </div>
                </div>

            </div>
        </>

    )
}