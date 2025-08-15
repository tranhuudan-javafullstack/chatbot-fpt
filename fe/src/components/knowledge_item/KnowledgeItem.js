import knowledgeImage from "../../assets/images/dataset_text.png"
import "./KnowLedgeItem.scss"
import IconButton from "../icon_button/icon_button";
import {Link} from "react-router-dom";
import {getDateFromTimestamp} from "../../utils/Functions";

export default function KnowledgeItem({createdAt,title, description,knowledgeId,type, size, time, enable, toggleShowDialog, toggleShowEdit}) {
    // function getDateFromTimestamp(timestamp) {
    //     const date = new Date(timestamp);
    //     const day = date.getDate();
    //     const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần +1
    //     const year = date.getFullYear();
    //
    //     return `${day}/${month}/${year}`;
    // }
    return(
        <>
                <tr className={"tr_knowledge"}>
                    <td className={"td_info"}>
                        <Link to={`/knowledge/${knowledgeId}/files`} className={"knowledge_link td_info"}>
                            <div className="knowledge_img">
                                <img src={knowledgeImage} alt=""/>
                            </div>
                            <div className="knowledge__content">
                                <span className="knowledge_title">{title}</span>
                                <span className="knowledge_description">{description}</span>
                            </div>
                        </Link>
                    </td>
                    <td>{type}</td>
                    {/*<td>{size}</td>*/}
                    <td>{getDateFromTimestamp(createdAt)}</td>
                    {/*<td><input type="checkbox" checked/></td>*/}
                    <td>
                        <div className={"td_action"}>
                            <IconButton onPress={()=> toggleShowEdit(title, description, knowledgeId)} title={"Edit"} icon={<i className="bi bi-pencil-fill"></i>} color={"#38c538"}/>
                            <IconButton onPress={()=>toggleShowDialog(knowledgeId)} title={"Delete"} icon={<i className="bi bi-trash-fill"></i>} color={"red"}/>
                        </div>
                    </td>
                </tr>

        </>
    )
}