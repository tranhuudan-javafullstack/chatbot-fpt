import "./SelectedKnowledgeModal.scss"
import knowledgeImage from "../../assets/images/dataset_text.png"
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {addKnowledgeToBot, deleteKnowledgeToBot} from "../../services/ChatBotService";
import {getKnowledges} from "../../services/KnowledgeService";
import {decryptToken} from "../../utils/Functions";
import Loading from "../loading/Loading";

export default function SelectedKnowledgeModal({toggleShowModal, knowledges, botId, addKnowledge, deleteKnowledge}) {
    const [myknowledges, setMyknowledges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    useEffect(() => {
       fetchMyKnowledge();
    }, [accessToken]);
    const fetchMyKnowledge = async () => {
        try {
            const myKnowledge = await getKnowledges(accessToken);
            setMyknowledges(myKnowledge.knowledges);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching chat:', error.message);
        }
    };
    const getTitleAction = (id) =>{
        const found = knowledges.find(knowledge => knowledge.knowledge_id === id);
        if (found) {
            return "Remove";
        } else {
            return "Add";
        }
    }
    function formatDate(dateString) {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            throw new Error("Invalid date string");
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${day}/${month}/${year}`;
    }
    const handleAddKnowlegeToBot = async (knowledgeId) => {
        try {
            const data = await addKnowledgeToBot(botId, knowledgeId, accessToken);
            addKnowledge(data.knowledges);
        } catch (error) {
            console.error('Error fetching chat:', error.message);
        }
    }
    const handleDeleteKnowlegeInBot = async (knowledgeId) => {
        try {
            const data = await deleteKnowledgeToBot(botId, knowledgeId, accessToken);
            deleteKnowledge(knowledgeId);
        } catch (error) {
            console.error('Error fetching chat:', error.message);
        }
    }
    const handleButton = (action, knowledgeId, event) => {
        event.preventDefault();
        if(action == "Add") return handleAddKnowlegeToBot(knowledgeId);
        return handleDeleteKnowlegeInBot(knowledgeId);
    }
    return (
        <div className="overlay">
            <div className="selected_knowledge__modal">
                <div className="modal__header">
                    <span className="modal__title">Chọn kiến thức</span>
                    <div onClick={toggleShowModal} className="modal_btn_close">
                        <i className="bi bi-x-lg"></i>
                    </div>
                </div>
                <div className="modal__body">
                    <div className="knowledge__wrapper">
                        {isLoading ? <Loading/> :  myknowledges.map((knowledge, index)=>{
                            const  action = getTitleAction(knowledge.knowledge_id);
                            return <Link className={"link"} to={`/knowledge/${knowledge.knowledge_id}/files`}> <div className="knowledge__container">
                                <div key={knowledge.knowledge_id} className="knowledge__container--left">
                                    <div className="image__container">
                                        <img src={knowledgeImage} alt=""/>
                                    </div>
                                    <div className="content__container">
                                        <span className="knowledge_title">{knowledge.name}</span>
                                        <span className="knowledge_description">{knowledge.description}</span>
                                        {/*<div className="tags__container">*/}
                                        {/*    <div className="tag"><span>1.9MB</span> </div>*/}
                                        {/*    <div className="tag"><span>1 Data</span></div>*/}
                                        {/*</div>*/}
                                        <span className="create_time">Create time: {formatDate(knowledge.created_at)}</span>
                                    </div>
                                </div>
                                <div onClick={(e)=> handleButton(action, knowledge.knowledge_id, e)} className="knowledge__container--right">
                                    <div className={`btn_action ${action == "Add" ? "" : "btn_action--delete"} `}>
                                        <span>{action}</span>
                                    </div>
                                </div>
                            </div></Link>
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
}