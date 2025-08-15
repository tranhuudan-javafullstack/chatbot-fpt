import "./FileItem.scss"
import word from "../../assets/images/word.png"
import txt from "../../assets/images/txt.png";
import pdf from "../../assets/images/pdf.png";

export default function FileItem({fileName, deleteFile}) {
    function getFileExtension() {
        const parts = fileName.split('.');
        return parts.length > 1 ? parts.pop() : '';
    }
    const getIcon = () =>{
        const extension = getFileExtension();
        if(extension == "pdf") return pdf;
        if(extension == "docx") return word;
        return txt;
    }
    return (
        <div className="file_item">
            <div className="file_img">
                <img src={getIcon()} alt=""/>
            </div>
            <p className="file_name">{fileName}</p>
            <div onClick={deleteFile} className="delete_file">
                <div className="btn_close">
                    <i className="bi bi-x"></i>
                </div>
            </div>
        </div>
    )
}