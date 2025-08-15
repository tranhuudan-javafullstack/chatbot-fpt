import "./FileDetail.scss"
import word from "../../assets/images/word.png"
import Chip from "../chip/Chip";
import {useEffect, useState} from "react";
import {getDetailFilesKnowledge} from "../../services/KnowledgeService";
import {decryptToken, formatBytes} from "../../utils/Functions";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import Loading from "../loading/Loading";
import {v4 as uuidv4} from 'uuid';

export default function FileDetail() {
    const { knowledgeId, fileId } = useParams();
    const accessToken = decryptToken(localStorage.getItem('access_token'));
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [fileDetail, setFileDetail] = useState(null);
    useEffect(() => {
        fetchData();
    }, [accessToken]);
    const fetchData = async () => {
        try {
            const data = await getDetailFilesKnowledge(accessToken, knowledgeId, fileId);
            setFileDetail(data);
            // dispatch(saveKnowledges(data.knowledges));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching knowledges:', error.message);
        }
    };
    return (
        <>
            {isLoading ? <Loading/> : <div className={"file_detail"}>
                <div className="file_detail__header">
                    <div className="file_detail__url">
                        <span className={"root_url"}>Kiến thức / Danh sách tài liệu / <span className={"target_url"}>{fileDetail.file.name }</span></span>
                    </div>
                    <div className="file_detail__infomation">
                        <div className="file_image"><img src={word} alt=""/></div>
                        <div className="file_info">
                            <div className="file__title">
                            <span className={"file__title--style"}>
                                {fileDetail.file.name}
                            </span>
                            </div>
                            <div className="file__tag">
                                <Chip text={`${fileDetail.file.chunk_count} đoạn`}/>
                                <Chip text={`${formatBytes(fileDetail.file.size)}`}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="file_detail__body">
                    <div className="file__content">
                        {fileDetail.chunks.map((chunk)=>{
                            return  <p key={uuidv4()} className="chunk">{chunk.chunks}</p>
                        })}
                    </div>
                </div>
            </div>}
        </>
    )
}