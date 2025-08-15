import botsIcon from "../../assets/images/bot.png"
import "./Bot.scss"
import BotItem from "../bot_item/BotItem";
import {useEffect, useState} from "react";
import BotModal from "../bot_modal/BotModal";
import {getBots} from "../../services/UserService";
import {useDispatch, useSelector} from "react-redux";
import {actionDeleteBot, actionUpdateBot, addBot, saveBots} from "../../store/actions/BotsAction";
import Loading from "../loading/Loading";
import {createBot, deleteBot, updateBot} from "../../services/BotsService";
import {decryptToken} from "../../utils/Functions";
import NotificationDialog from "../notification_dialog/NotificationDialog";

export default function Bot() {
    const [editBotModal, setEditBotModal] = useState(false);
    const [titleBot, setTitleBot] = useState("");
    const [descriptionBot, setDescriptionBot] = useState("");
    const [botIdEdit, setBotIdEdit] = useState("");
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    const bots = useSelector((state) => state.botReducer.bots);
    // const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const [showDialog, setShowDialog] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    useEffect(() => {
        fetchData();
    }, [accessToken]);
    const fetchData = async () => {
        try {
            const data = await getBots(accessToken);
            // setBots(data.bots);
            dispatch(saveBots(data.bots));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching bots:', error.message);
        }
    };
    const toggleShowDialog = (botId = "") => {
        setDeleteId(botId);
        setShowDialog(!showDialog);
    }
    const toggleEditBotModel = (titleBot="", descriptionBot="", botId = "") => {
        setTitleBot(titleBot);
        setDescriptionBot(descriptionBot);
        setBotIdEdit(botId);
        setEditBotModal(!editBotModal);
    }
    const confirm = async (titleBot, descriptionBot, botId) => {
        try {
            if(botId){
                const data = await updateBot(botId,titleBot, descriptionBot, accessToken);
                dispatch(actionUpdateBot(data));
            }else{
                const data = await createBot(titleBot, descriptionBot,accessToken);
                dispatch(addBot(data));
            }
            toggleEditBotModel();
        } catch (error) {
            console.error('Error create bot:', error.message);
        }
    }
    const handleDelete = async (botId) => {
        try {
            const data = await deleteBot(botId, accessToken);
            dispatch(actionDeleteBot(botId));
            toggleShowDialog();
        } catch (error) {
            console.error('Error create bot:', error.message);
        }
    }
    return (
        <>
            {isLoading ? <Loading/> : <div className={"bot_page"}>
                <div className="bot_page__header">
                    <div className="bot_page__title">
                        <img src={botsIcon} alt=""/><p className={"title"}>Bots</p>
                    </div>
                    <div className="bot_page__btn">
                        <div onClick={()=>toggleEditBotModel()} className={"btn_create_bot"}>
                            <p className={"btn_create_bot--text"}>Tạo bot</p>
                        </div>
                    </div>
                </div>
                <div className="bot_page__body">
                    {bots.map((bot, index)=>{
                        return <BotItem key={bot.bot_id} handleDelete={()=>toggleShowDialog(bot.bot_id)} botId={bot.bot_id} title={bot.name} description={bot.description} createAt={bot.created_at} toggleEditBot={toggleEditBotModel}/>
                    })}
                </div>
                {showDialog && <NotificationDialog confirm={()=> handleDelete(deleteId)} title={"Xác nhận để xóa bot"} mesage={"Bạn chắc chắn muốn xóa bot này?"}
                                                   cancelDialog={toggleShowDialog}/>}
                {editBotModal && <BotModal botId={botIdEdit} confirm={confirm} title={titleBot} description={descriptionBot} toggleCreateBotModel={toggleEditBotModel}/>}
            </div>}
        </>

    )
}