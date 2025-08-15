import "./Knowledge.scss"
import knowledgeImage from "../../assets/images/knowledge.png";
import KnowledgeItem from "../knowledge_item/KnowledgeItem";
import {useEffect, useState} from "react";
import NotificationDialog from "../notification_dialog/NotificationDialog";
import KnowledgeModal from "../knowledge_modal/KnowledgeModal";
import {decryptToken} from "../../utils/Functions";
import {useDispatch, useSelector} from "react-redux";
import Loading from "../loading/Loading";
import {createKnowledge, deleteKnowledge, getKnowledges, updateKnowledge} from "../../services/KnowledgeService";
import {
    actionDeleteKnowledge,
    actionUpdateKnowledge,
    addKnowledge,
    saveKnowledges
} from "../../store/actions/KnowledgeAction";

export default function Knowledge() {
    const [showDialog, setShowDialog] = useState(false);
    const [showCreateKnowledge, setShowCreateKnowLedge] = useState(false);
    const [titleKnowledge, setTitleKnowledge] = useState("");
    const [descriptionKnowledge, setDescriptionKnowledge] = useState("");
    const [knowledgeIdEdit, setKnowledgeIdEdit] = useState("");
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const knowledges = useSelector((state) => state.knowledgeReducer.knowledges);
    useEffect(() => {
        fetchData();
    }, [accessToken]);
    const fetchData = async () => {
        try {
            const data = await getKnowledges(accessToken);
            dispatch(saveKnowledges(data.knowledges));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching knowledges:', error.message);
        }
    };
    const toggleShowDialog = (knowledgeId = "") => {
        setKnowledgeIdEdit(knowledgeId);
        setShowDialog(!showDialog);
    }
    const toggleEditKnowledge = (titleKnowledge="", descriptionKnowledge="", knowledgeId = "") => {
        setTitleKnowledge(titleKnowledge);
        setDescriptionKnowledge(descriptionKnowledge);
        setKnowledgeIdEdit(knowledgeId);
        setShowCreateKnowLedge(!showCreateKnowledge);
    }
    const confirm = async (titleKnowledge, descriptionKnowledge, knowledgeId) => {
        try {
            if(knowledgeId){
                const data = await updateKnowledge(knowledgeId,titleKnowledge, descriptionKnowledge, accessToken);
                dispatch(actionUpdateKnowledge(data));
            }else{
                const data = await createKnowledge(titleKnowledge, descriptionKnowledge,accessToken);
                dispatch(addKnowledge(data));
            }
            toggleEditKnowledge();
        } catch (error) {
            console.error('Error confirm knowledge:', error.message);
        }
    }
    const handleDeleteKnowledge = async (knowledgeId) => {
        try {
            const data = await deleteKnowledge(knowledgeId, accessToken);
            dispatch(actionDeleteKnowledge(knowledgeId));
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
                        <img src={knowledgeImage} alt=""/><p className={"title"}>Kiến thức</p>
                    </div>
                    <div onClick={()=>toggleEditKnowledge()} className="bot_page__btn">
                        <div className={"btn_create_bot"}>
                            <p className={"btn_create_bot--text"}>Tạo kiến thức</p>
                        </div>
                    </div>
                </div>
                <div className="bot_page__body">
                    <table className={"table_wrapper"}>
                        <thead className={"thead--border"}>
                        <tr>
                            <th>Kiến thức</th>
                            <th>Kiểu</th>
                            {/*<th>Kích thước</th>*/}
                            <th>Thời gian tạo</th>
                            {/*<th>Enable</th>*/}
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {knowledges.map((knowledge, index)=>{
                            return <KnowledgeItem createdAt={knowledge.created_at} key={knowledge.knowledge_id} knowledgeId={knowledge.knowledge_id} title={knowledge.name} description={knowledge.description} type={"Text"} size={"1.9 MB"} toggleShowEdit={toggleEditKnowledge} toggleShowDialog={toggleShowDialog}/>
                        })}
                        </tbody>
                    </table>
                </div>
                {showDialog && <NotificationDialog confirm={()=> handleDeleteKnowledge(knowledgeIdEdit)} title={"Xác nhận để xóa"} mesage={"Bạn chắc chắn muốn xóa kiến thức này?"}
                                                   cancelDialog={toggleShowDialog}/>}
                {showCreateKnowledge && <KnowledgeModal confirm={confirm} knowledgeId={knowledgeIdEdit} title={titleKnowledge} description={descriptionKnowledge} titleForm={"Create knowledge"} toggleShow={toggleEditKnowledge}/>}
            </div>}
        </>

    )
}