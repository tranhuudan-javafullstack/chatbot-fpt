import './TextButtonIcon.scss'

export default function TextButtonIcon({title, icon, onPress, background, color}) {
    return (
        <div className={"button button--radius"} onClick={onPress} style={{color: color, background: background}}>
            {icon && <span title={"button__icon"}>{icon}</span>}
            <span style={{color: color}}  className={"button__title"}>{title}</span>
        </div>
    )
}