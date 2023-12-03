import React, {Dispatch, SetStateAction, useState} from "react";
import {Checkbox} from "antd";
import BotInfo from "../../Modals/BotInfo/BotInfo";
import {Bot} from "../../../Model/Bot";

interface ShortInfoProps {
    selected: boolean,
    setSelected: Dispatch<SetStateAction<boolean>>,
    bot: Bot,
    bots: Bot[],
    status: string,
}

const HeadInfo: React.FC<ShortInfoProps> = (props: ShortInfoProps) => {
    const [showBotInfo, setShowBotInfo] = useState(false);

    return (
        <>
            <div className="bot-item-top">
                <div className={"bot-item-icon"}>
                    <span className="icon-bot-phone" style={{fontSize: 30}} />
                </div>

                <div className="bot-item-info" onClick={() => setShowBotInfo(true)}>
                    <div className="bot-item-name">
                        {props.bot.id}
                    </div>

                    <div className={`bot-item-status ${props.status}`}>{props.status}</div>
                </div>

                <div className="bot-item-select">
                    <Checkbox
                        style={{transform: "scale(1.5)"}}
                        checked={props.selected}
                        onChange={() => {
                            props.setSelected(!props.selected);
                        }}
                    />
                </div>
            </div>

            <div className="bot-item-country">
                <div
                    className="bot-item-country-image"
                    style={{
                        backgroundImage: `url(https://purecatamphetamine.github.io/country-flag-icons/3x2/${props.bot.country_code.toUpperCase()}.svg)`,
                    }}
                />

                <span>{props.bot.country}</span>
            </div>

            <BotInfo visible={showBotInfo} setVisible={setShowBotInfo} bot={props.bot} />
        </>
    );
};

export default HeadInfo;
