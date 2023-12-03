import React from "react";
import {Col, Divider, Tag} from "antd";
import {Bot} from "../../../Model/Bot";
import Permissions from "./Permissions";
import Information from "./Information";
import Injections from "./Injections";
import HeadInfo from "./HeadInfo";
import Actions from "./Actions";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../Store/RootReducer";
import {changeSelectedBot} from "../../../Store/Bots/Actions";
import moment from "moment-timezone";
import BotDataButtons from "./BotDataButtons";

interface BotsItemProps {
    bot: Bot,
    isLoaded: boolean,
    bots: Bot[],
}

const BotsItem: React.FC<BotsItemProps> = (props: BotsItemProps) => {
    const lastConnectionDiff = moment().diff(moment(props.bot.updated_at)) / 1000;

    const lastConnectionStatus = lastConnectionDiff <= 60 ? "online" : (lastConnectionDiff >= 144000 ? "removed_app": "offline");

    const botsReducer = useSelector((state: AppState) => state.bots);

    const isSelected = botsReducer.selectedBots.filter((bot: Bot) => {
        return props.bot.id === bot.id;
    }).length > 0;

    const dispatch = useDispatch();

    return (
        <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24} className={isSelected ? "bot-col selected" : "bot-col"}>
            <div className={`bot-item ${lastConnectionStatus}`}>
                <div className="bot-item-body">
                    <HeadInfo
                        status={lastConnectionStatus}
                        selected={isSelected}
                        setSelected={() => dispatch(changeSelectedBot(props.bot))}
                        bot={props.bot}
                        bots={botsReducer.bots}
                    />

                    <Permissions bot={props.bot} />

                    <div className="bot-item-tags">
                        <Divider orientation="center" style={{margin: "5px 0"}}>
                            <Tag color="#177ddc" style={{marginRight: 0}}>{props.bot.tag}</Tag>
                        </Divider>
                    </div>

                    <BotDataButtons bot={props.bot} />

                    <Information bot={props.bot} lastConnectionDiff={lastConnectionDiff} />

                    <Injections bot={props.bot} />
                </div>

                <Actions bot={props.bot} />
            </div>
        </Col>
    );
};

export default BotsItem;
