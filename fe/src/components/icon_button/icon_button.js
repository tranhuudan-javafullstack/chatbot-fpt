import './icon_button.scss'

export default function IconButton({icon, onPress, color, title}) {
    return (
        <div title={title} onClick={onPress} className={"icon_button"} style={{color: color}}>
            {icon}
        </div>
    )
}