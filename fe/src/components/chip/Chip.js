import "./Chip.scss"

export default function Chip({text}) {
    return(
        <div className={"chip"}>
            <span className={"chip__text"} >{text}</span>
        </div>
    )
}