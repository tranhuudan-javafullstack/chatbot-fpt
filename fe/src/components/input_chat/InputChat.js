import './InputChat.scss'
import {useEffect, useRef, useState} from "react";

export default function InputChat({sendMessage}) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);
    const handleChange = (e) => {
        setMessage(e.target.value);
    };
    const handleSendMessage = () => {
        if(message == "") return;
        setMessage("");
        sendMessage(message);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (
        // <div className={"input__wrapper"}>
            <div className={"input__container"}>
                {/*<div className="btn-attach">*/}
                {/*    <i className="bi bi-paperclip"></i>*/}
                {/*</div>*/}
                <div className={"input"}><textarea ref={textareaRef} onKeyDown={handleKeyDown}
                                                   value={message} onChange={handleChange} rows={1}/></div>
                <div onClick={handleSendMessage} className={"btn_send"}>
                    <i className="bi bi-arrow-right"></i>
                </div>
            </div>
        // </div>

    )
}