import "./UploadFileModal.scss"
import FileItem from "../file_item/FileItem";

import TextButtonIcon from "../icon_text_button/TextButtonIcon";
import {useRef, useState} from "react";
import {v4 as uuidv4} from "uuid";

export default function UploadFileModal({toggleShow, confirm}) {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [isProcess, setIsProcess] = useState(false);
    const handleChooseFile = () => {
        fileInputRef.current.click();
    };
    const uploadDocument = (e) => {
        const files = e.target.files;
        setFiles(prevFiles => [...prevFiles, ...files]);
    }
    const handleFileRemove = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    };
    const handleConfirm = async () => {
        setIsProcess(true);
        await confirm(files);
        setIsProcess(false);
    }
    // useEffect(() => {
    //     if (isProcess) {
    //         const processFiles = async () => {
    //             await confirm(files);
    //             setIsProcess(false); // Turn off loading state after processing is done
    //         };
    //         processFiles();
    //     }
    // }, [isProcess, confirm, files]);
    return (
        <div className="overlay">
            <div className="new_bot__modal ">
                <h2 className="title_form">Thêm tài liệu</h2>
                <form className={"new_bot__modal-body"}>
                     <div className={"form-field"}>
                        <label className={"label"}>Tải lên</label>
                        <div className="input__wrapper">
                            <input className={"input_file"} onChange={uploadDocument} type={"file"} ref={fileInputRef} multiple/>
                            <div onClick={handleChooseFile} className="upload">
                                <i className="bi bi-cloud-arrow-up-fill"></i>
                                <span className="input-title">Bấm để tải lên</span>
                                <span className="input-sub">Tải lên file có dạng TXT, DOC, PDF</span>
                            </div>
                        </div>
                        <div className="files_container">
                            {files.map((file, index)=><FileItem key={uuidv4()} fileName={file.name} deleteFile={()=>handleFileRemove(index)}/>)}
                        </div>
                    </div>
                </form>
                {isProcess && <>
                    <div className={"process_data"}>
                        <div className="loader_item"></div>
                        <div className="loader_item"></div>
                        <div className="loader_item"></div>
                        <div className="loader_item"></div>
                        <div className="loader_item"></div>
                        <div className="loader_item"></div>
                        <div className="loader_item"></div>
                        <div className="loader_item"></div>
                    </div>
                    <div className={"loading_label"}>
                        <span className={"loading_label"}>Đang xử lý dữ liệu...</span>
                    </div>
                </>}
                <div className="new_bot__modal-footer">
                    <TextButtonIcon title={"Hủy"} onPress={toggleShow} background={"#FFFFFF"} color={"#1C1C1C"}/>
                    {/*<TextButtonIcon title={"Confirm"} onPress={()=>confirm(files)}/>*/}
                    <TextButtonIcon title={"Xác nhận"} onPress={handleConfirm}/>
                </div>
            </div>
        </div>
    )
}