import "./Loading.scss"

export default function Loading(){
    return (
        <div className={"loading-area"}>
            <div className="loader">
                <div className="loader_item"></div>
                <div className="loader_item"></div>
                <div className="loader_item"></div>
                <div className="loader_item"></div>
                <div className="loader_item"></div>
                <div className="loader_item"></div>
                <div className="loader_item"></div>
                <div className="loader_item"></div>
            </div>
            <span className={"loading_label"}>Đang tải...</span>
        </div>
    )
}