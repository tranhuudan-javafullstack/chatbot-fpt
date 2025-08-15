import "./DocumentViewer.scss"
import document from "../../assets/images/word.png";
import pdf from "../../assets/images/pdf.png";
import bot from "../../assets/images/bot.png";
import txt from "../../assets/images/txt.png";

import {useEffect, useState} from "react";
import sidebar from "../../assets/icons/sidebar.png";

export default function DocumentViewer({chats, showContext, setShowContext}) {
    const [dropdownStates, setDropdownStates] = useState({});
    const [filesContext, setFilesContext] = useState({});
    useEffect(() => {
        if(chats.length > 0 ){
            setFilesContext(groupChunksByFileAndKnowledge(chats[chats.length - 1].question.chunks));
        }else{
            setFilesContext({});
        }
    }, [chats]);
    const getFileImage = (fileType) => {
        if(fileType == "docx") return document;
        if(fileType == "pdf") return pdf;
        return txt;
    }
    const groupChunksByFileAndKnowledge = (chunks) => {
        const groupedChunks = {};
        chunks.forEach((chunk) => {
            const key = `${chunk.file_name}-${chunk.knowledge_name}`;
            if (!groupedChunks[key]) {
                groupedChunks[key] = [];
            }
            groupedChunks[key].push(chunk);
        });
        return groupedChunks;
    };
    const toggleDropdown = (id) => {
        setDropdownStates((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    return (
        <>
            <div onClick={()=>setShowContext(!showContext)} className={`btn_toggle_context ${showContext ? "" :"btn_toggle_context--transform"} `}>
                <img src={sidebar} alt=""/>
            </div>
            <div className={`chat_area document_viewer ${showContext ? "" : " document--hidden"}`}>
                <div className="chat_area__title">
                    <span>Document viewer</span>
                </div>
                <div className="chat_area__message document_viewer">
                    <div className="document_viewer__body">
                        <div className="header_tag">
                            <img src={bot} alt=""/>
                            <span className={""}>Context Used</span>
                        </div>
                        <div className="context_used__container">
                            <div className="context">
                                {Object.keys(filesContext).map((key, index)=>{
                                    const chunk = filesContext[key][0];
                                    return <div key={index}>
                                        <div  className="document_viewer__header">
                                            <div className="document_relate__container">
                                                <div className="document_relate">
                                                    <div className="document_relate__image">
                                                        <img src={getFileImage(chunk.file_type)} alt=""/>
                                                    </div>
                                                    <div className="document_relate__info">
                                                        <span className="title">{chunk.file_name}</span>
                                                        <span className="sub_content">
                                                        from knowledge {chunk.knowledge_name}
                                                    </span>
                                                    </div>
                                                    <div title={"Show detail chunks"} onClick={() => toggleDropdown(index)} className="btn_show">
                                                        <span><i className="bi bi-caret-down-fill"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {dropdownStates[index] && (
                                            <div className="dropdown-content">
                                                {filesContext[key].map((chunk, chunkIndex)=>{
                                                    return <p key={chunk.chunk_id} className="chunk">{chunk.chunks}</p>
                                                })}
                                            </div>
                                        )}
                                    </div>

                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}