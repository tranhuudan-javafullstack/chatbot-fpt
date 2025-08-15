import './SideBarItem.scss'
import {Link} from "react-router-dom";

export default function SideBarItem({title, icon, url, index, selectedIndex, handleSelect}) {
    return (
        <Link to={url} style={{ textDecoration: 'none' }}>
            <div onClick={()=>handleSelect(index)} className={`drawbar__item ${index == selectedIndex ? "item_selected" : ""}`}>
                <span className={"drawbar__item--icon"}>{icon}</span>
                <span className={"drawbar__item--title"}>{title}</span>
            </div>
        </Link>
    )
}