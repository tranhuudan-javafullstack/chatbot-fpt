import "./ChatPage.scss";
import ChatSideBar from "../../components/chat_side_bar/ChatSideBar";
import {Outlet, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {decryptToken} from "../../utils/Functions";
import {useDispatch} from "react-redux";
import {getChatsBot} from "../../services/ChatBotService";
import {saveChatsBot} from "../../store/actions/ChatAction";
import Loading from "../../components/loading/Loading";
import BotWelcome from "../../components/bot_welcome/BotWelcome";

export default function ChatPage() {
    const { botId, chatId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    const dispatch = useDispatch();
    useEffect(() => {
        fetchData();
    }, [accessToken]);
    const fetchData = async () => {
        try {
            const data = await getChatsBot(accessToken, botId);
            dispatch(saveChatsBot(data));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching bots:', error.message);
        }
    };
    return (
        <>
            {isLoading ? <Loading/> : <div className={"chat"}>
                <ChatSideBar botId={botId}/>
                <div className={"safe_area chat_safe"} style={{flex: 1}}>
                    {/*<ChatArea/>*/}
                    {/*<DocumentViewer/>*/}
                    {!chatId && <BotWelcome/> }
                    <Outlet/>
                </div>
            </div>}
        </>

    )
}