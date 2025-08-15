import "./TextAreaModal.scss"

export default function TextAreaModal({label,placeHolder, maxLength, onChangeInput, currentLength, value}) {
    return (
        <div className={"form-field"}>
            <label className={"label"}>{label}</label>
            <div className="input__wrapper">
                <textarea name="" id="" rows={4} value={value} cols={20} onChange={(e)=> {onChangeInput(e.target.value)}} maxLength={maxLength} className="input text_area" placeholder={placeHolder}></textarea>
                <span className={"input-length"}>{`${currentLength} / ${maxLength}`}</span>
            </div>
        </div>
    )
}