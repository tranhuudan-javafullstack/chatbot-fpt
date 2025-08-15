import "./ChatSideBarItem.scss"
import {useEffect, useRef, useState} from "react";
import NotificationDialog from "../notification_dialog/NotificationDialog";
import {Link} from "react-router-dom";
import {deleteChatBot, updateChatBot} from "../../services/ChatBotService";
import {actionDeleteChat, actionUpdateChat} from "../../store/actions/ChatAction";
import {decryptToken} from "../../utils/Functions";
import {useDispatch} from "react-redux";

export default function ChatSideBarItem({title,botId, chatId,index, selectedIndex, handleSelected}) {
    const [showOptions, setShowOptions] = useState(false);
    const [showRename, setShowRename] = useState(false);
    const [titleChat, setTitleChat] = useState(title)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const dropdownRef = useRef(null);
    const renameRef = useRef(null);
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    const dispatch = useDispatch();
    useEffect(() => {
        if (showOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        if(showRename){
            document.addEventListener("mousedown", handleClickOutsideInput);
        }else{
            document.removeEventListener("mousedown", handleClickOutsideInput);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mousedown", handleClickOutsideInput);
        };
    }, [showOptions,showRename]);
    useEffect(() => {
        if (showRename && renameRef.current) {
            renameRef.current.focus();
        }
    }, [showRename]);
    const handleClickOutsideInput = (event)=>{
        if (renameRef.current && !renameRef.current.contains(event.target)) {
            toggleShowRename();
            handleRename();
        }
    }
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            toggleShowOptions();
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            toggleShowRename();
            handleRename();
        }
    };

    const handleRename = async () => {
        try {
            const data = await updateChatBot(titleChat, accessToken, botId,chatId)
            dispatch(actionUpdateChat(data));
        } catch (error) {
            console.error('Error Rename:', error.message);
        }
    }
    const confirmDelete = async () => {
        try {
            const data = await deleteChatBot(accessToken, botId,chatId)
            dispatch(actionDeleteChat(chatId));
            toggleShowDeleteDialog();
        } catch (error) {
            console.error('Error Rename:', error.message);
        }
    }
    const onChangeTitle = (e) => {
        setTitleChat(e.target.value);
    };
    const toggleShowDeleteDialog = () => {
        setShowDeleteDialog(!showDeleteDialog);
    }
    const toggleShowRename = () => {
        // renameRef.current.focus();
        setShowRename(!showRename);
        setShowOptions(false);
    }
    const toggleShowOptions = () => {
        setShowOptions(!showOptions);
    }
    return (
        <Link key={chatId}  to={`/bots/${botId}/chat/${chatId}`} className={"link"}>
            <div key={chatId} onClick={()=>handleSelected(index)} className={`chat_bar__item ${index == selectedIndex ? "chat_bar__item--selected":""}`}>
                <span className="item_title">{titleChat}</span>
                <div className="options_dropdown" ref={dropdownRef}>
                    <div onClick={toggleShowOptions} className="btn_option">
                        <i className="bi bi-three-dots"></i>
                    </div>
                    <div className={`dropdown-content ${showOptions ? "dropdown-content--show":""} `}>
                        <div onClick={toggleShowRename} className="dropdown-btn">
                            <i className="bi bi-pencil-fill"></i>
                            <span className={"dropdown-btn-title"}>Rename</span>
                        </div>
                        <div onClick={toggleShowDeleteDialog} className="dropdown-btn btn-delete">
                            <i className="bi bi-trash-fill"></i>
                            <span className={"dropdown-btn-title"}>Delete</span>
                        </div>
                    </div>
                </div>
                <div  className={`rename__container ${showRename ? "rename__container--show":""}`}>
                    <input ref={renameRef} onKeyDown={handleKeyDown} onChange={onChangeTitle} value={titleChat} type="text" className="input_rename"/>
                </div>
                {showDeleteDialog && <NotificationDialog confirm={confirmDelete} title={"Delete chat?"} mesage={`This action will delete "${titleChat}"`} cancelDialog={toggleShowDeleteDialog}/>}
            </div>
        </Link>
    )
}