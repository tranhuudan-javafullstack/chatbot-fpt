import InputModal from "../input_modal/InputModal";
import TextAreaModal from "../textarea_modal/TextAreaModal";
import TextButtonIcon from "../icon_text_button/TextButtonIcon";
import {useEffect, useState} from "react";
import "./BotModal.scss"

export default function BotModal({botId,toggleCreateBotModel, confirm, title, description}) {
    const [titleBot, setTitleBot] = useState("");
    const [descriptionBot, setDescriptionBot] = useState("");
    useEffect(() => {
        if (title) {
            setTitleBot(title);
        }
        if (description) {
            setDescriptionBot(description);
        }
    }, [title, description]);
    return (
        <div className="overlay">
            <div className="new_bot__modal ">
                <h2 className="title_form">{botId ? "Chỉnh sửa bot":"Tạo bot"} </h2>
                <form className={"new_bot__modal-body"}>
                    <InputModal currentLength={titleBot.length} value={titleBot} onChangeInput={setTitleBot} label={"Tên bot"} placeHolder={"Đặt cho bot một cái tên duy nhất"} maxLength={40}/>
                    <TextAreaModal value={descriptionBot} currentLength={descriptionBot.length} onChangeInput={setDescriptionBot} label={"Mô tả chức năng bot"} placeHolder={"Nhập mô tả cho bot"} maxLength={350}/>
                </form>
                <div className="new_bot__modal-footer">
                    <TextButtonIcon title={"Hủy"} onPress={toggleCreateBotModel} background={"#FFFFFF"} color={"#1C1C1C"}/>
                    <TextButtonIcon title={"Xác nhận"} onPress={()=>confirm(titleBot, descriptionBot, botId)}/>
                </div>
            </div>
        </div>
    )
}