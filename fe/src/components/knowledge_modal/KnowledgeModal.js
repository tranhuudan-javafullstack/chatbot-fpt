import InputModal from "../input_modal/InputModal";
import TextAreaModal from "../textarea_modal/TextAreaModal";
import TextButtonIcon from "../icon_text_button/TextButtonIcon";
import {useEffect, useRef, useState} from "react";
import "./KnowledgeModal.scss"

export default function KnowledgeModal({knowledgeId,titleForm,toggleShow, confirm, title, description}) {
    const [knowledgeName, setKnowledgeName] = useState(title);
    const [descriptionKnowledge, setDescriptionKnowledge] = useState(description);
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [formTitle, setFormTitle] = useState("Create knowledge");
    useEffect(() => {
        if (title) {
            setKnowledgeName(title);
            setFormTitle("Edit knowledge")
            console.log("Edit knowledge");
        }else{
            setFormTitle("Create knowledge")
            setKnowledgeName("");
            console.log("Create knowledge");
        }
        if (description) {
            setDescriptionKnowledge(description);
        }else{
            setDescriptionKnowledge("");
        }
    }, [title, description]);
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
    return(
        <div className="overlay">
            <div className="new_bot__modal ">
                <h2 className="title_form">{formTitle}</h2>
                <form className={"new_bot__modal-body"}>
                    <InputModal currentLength={knowledgeName.length} value={knowledgeName} onChangeInput={setKnowledgeName} label={"Name"} placeHolder={"Dataset name cannot be empty"} maxLength={100}/>
                    <TextAreaModal value={descriptionKnowledge} currentLength={descriptionKnowledge.length} onChangeInput={setDescriptionKnowledge} label={"Bot function description"} placeHolder={"Enter the content of the dataset"} maxLength={2000}/>
                    {/*{formTitle == "Create knowledge" && <div className={"form-field"}>*/}
                    {/*    <label className={"label"}>Upload</label>*/}
                    {/*    <div className="input__wrapper">*/}
                    {/*        <input className={"input_file"} onChange={uploadDocument} type={"file"} ref={fileInputRef} multiple/>*/}
                    {/*        <div onClick={handleChooseFile} className="upload">*/}
                    {/*            <i className="bi bi-cloud-arrow-up-fill"></i>*/}
                    {/*            <span className="input-title">Click to upload</span>*/}
                    {/*            <span className="input-sub">Up load format TXT, DOC, PDF</span>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="files_container">*/}
                    {/*        {files.map((file, index)=><FileItem fileName={file.name} deleteFile={()=>handleFileRemove(index)}/>)}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*}*/}
                </form>
                <div className="new_bot__modal-footer">
                    <TextButtonIcon title={"Cancel"} onPress={toggleShow} background={"#FFFFFF"} color={"#1C1C1C"}/>
                    <TextButtonIcon title={"Confirm"} onPress={()=>confirm(knowledgeName, descriptionKnowledge, knowledgeId)}/>
                </div>
            </div>
        </div>
    )
}