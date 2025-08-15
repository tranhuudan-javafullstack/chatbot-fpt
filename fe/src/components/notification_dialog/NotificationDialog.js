import "./Notification.scss"
import TextButtonIcon from "../icon_text_button/TextButtonIcon";

export default function NotificationDialog({title, mesage,cancelDialog, confirm}) {
    return (
        <div className="overlay">
            <div className="dialog">
                <span className="dialog_title">{title}</span>
                <div className="dialog_body">
                    <p className="dialog_message">{mesage}</p>
                </div>
                <div className="dialog_footer">
                    <TextButtonIcon onPress={cancelDialog} title={"Hủy"} background={"#EFEFEF"} color={"black"}/>
                    <TextButtonIcon onPress={confirm} title={"Xác nhận"} background={"red"}/>
                </div>
            </div>
        </div>
    )
}