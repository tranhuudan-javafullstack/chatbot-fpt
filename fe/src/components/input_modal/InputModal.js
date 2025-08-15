import "./InputModal.scss"

export default function InputModal({type,label,placeHolder, maxLength, onChangeInput, currentLength, value}) {
    return(
        <div className={"form-field"}>
            <label className={"label"}>{label}</label>
            <div className="input__wrapper">
                <input type={type ? type: "text"} className={"input"} value={value} onChange={(e)=> {onChangeInput(e.target.value)}} placeholder={placeHolder} maxLength={maxLength}/>
                {maxLength && <span className={"input-length"}>{`${currentLength} / ${maxLength}`}</span>}
            </div>
        </div>
    )
}