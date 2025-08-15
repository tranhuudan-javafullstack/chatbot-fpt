import "./ChatMessageItem.scss"
import avatarBot from "../../assets/images/bot.png";
import {ReactComponent as CopyIcon} from "../../assets/svg/copy.svg";

export default function ChatMessageItem({totalTime, token,message, mySelf, isProcess}) {
    return (
        <div className={`chat_message__wrapper ${mySelf ? "chat_message__wrapper--self":""}`}>
            {!mySelf && <div className="avatar_bot"><img src={avatarBot} alt=""/></div>}
            {message =='' && !mySelf ? <div className={`chat_message__process`}>
                <div className="loading_message">
                    <div className="loading_item"></div>
                    <div className="loading_item"></div>
                    <div className="loading_item"></div>
                </div>
            </div> : <div className="chat_message__item">
                <div className={`chat_message `}>
                    <span className={"message"}>{message}</span>
                </div>
                {!mySelf && <div className="action_message">
                    <div className="message_sub_info">
                        <span className="info_response">
                            <i className="bi bi-check-lg"></i> {totalTime}s | {token} Tokens
                        </span>
                    </div>
                    <div className="action_btn__wrapper">
                        <div className="action_btn action_btn--copy"><CopyIcon/></div>
                        <div className="action_btn"><i className="bi bi-arrow-clockwise"></i></div>
                    </div>
                </div>}
            </div>}
        </div>
    )
}