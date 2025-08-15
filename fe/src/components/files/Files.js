import "./Files.scss"
import document from "../../assets/images/dataset_text.png";
import TrFileItem from "../tr_file_item/TrFileItem";
import NotificationDialog from "../notification_dialog/NotificationDialog";
import {useEffect, useState} from "react";
import UploadFileModal from "../upload_file_modal/UploadFileModal";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {decryptToken} from "../../utils/Functions";
import {addFileToKnowledge, deleteFileFromKnowledge, getFilesKnowledge} from "../../services/KnowledgeService";
import {saveCurrentFiles} from "../../store/actions/KnowledgeAction";
import Loading from "../loading/Loading";

export default function Files() {
    const { knowledgeId } = useParams();
    const [showDialog, setShowDialog] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    const files =  useSelector((state) => state.knowledgeReducer.currentFileOfKnowledge?.files);
    const [fileIdDelete, setFileIdDelete] = useState("");
    useEffect(() => {
        fetchData();
    }, [accessToken]);
    const fetchData = async () => {
        try {
            const data = await getFilesKnowledge(accessToken, knowledgeId);
            dispatch(saveCurrentFiles(data));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching knowledges:', error.message);
        }
    };
    const toggleShowUploadModal = ()=>{
        setShowUploadModal(!showUploadModal);
    }
    const toggleShowDialog = (id) => {
        setFileIdDelete(id);
        setShowDialog(!showDialog);
    }
    const handleUploadDatasets = async (files) => {
        try {
            const data = await addFileToKnowledge(files, knowledgeId, accessToken);
            await fetchData();
            toggleShowUploadModal();
        } catch (error) {
            console.error('Error upload file:', error.message);
        }
    }
    const handleDeleteDataset = async (fileId) => {
        try {
            const data = await deleteFileFromKnowledge(fileId, knowledgeId, accessToken);
            await fetchData();
            toggleShowDialog("");
        } catch (error) {
            console.error('Delete file error:', error.message);
        }
    }
    return (
        <>
            {isLoading ? <Loading/> : <div className={"bot_page"}>
                <div className="bot_page__header">
                    <div className="bot_page__title">
                        <img className={"img_radius"} src={document} alt=""/><p className={"title"}>Danh sách tài liệu</p>
                    </div>
                    <div  className="bot_page__btn">
                        <div onClick={toggleShowUploadModal} className={"btn_create_bot"}>
                            <p className={"btn_create_bot--text"}>Tải tài liệu lên</p>
                        </div>
                    </div>
                </div>
                <div className="bot_page__body">
                    <table className={"table_wrapper"}>
                        <thead className={"thead--border"}>
                        <tr>
                            <th>Tài liệu</th>
                            <th>Loại</th>
                            <th>Kích thước</th>
                            <th>Số lượng đoạn</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            files.map((file)=> {
                                return <TrFileItem key={file.file_id} knowledgeId={knowledgeId} fileId={file.file_id} name={file.name} chunkCount={file.chunk_count} type={file.file_type} size={file.size} toggleShowDialog={()=>toggleShowDialog(file.file_id)}/>
                            })
                        }
                        </tbody>
                    </table>
                </div>
                {showDialog && <NotificationDialog confirm={()=>handleDeleteDataset(fileIdDelete)} title={"Xác nhận xóa"} mesage={"Bạn có chắc chắn muốn xóa tài liệu này?"}
                                                   cancelDialog={toggleShowDialog}/>}
                {showUploadModal && <UploadFileModal confirm={handleUploadDatasets} toggleShow={toggleShowUploadModal}/>}
            </div>}
        </>

    )
}