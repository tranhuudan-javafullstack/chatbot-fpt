import bot from "../../assets/images/bot.png";
import "./HomeWelcome.scss";

export default function HomeWelcome() {
    return (
        <div className={"home_welcome"}>
            <div className="image_bot">
                <img src={bot} alt=""/>
            </div>
            <div className={"content__wrapper"}>
                <span className={"title_large"}>Welcome to ViEmbeddingNLU</span>
                {/*<span className={"sub_info"}>Select an existing chat or create a new one to get started</span>*/}
            </div>
        </div>
    )
}