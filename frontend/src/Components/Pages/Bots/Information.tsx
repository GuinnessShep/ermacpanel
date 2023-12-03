import React from "react";
import {Divider, Tooltip} from "antd";
import {Bot} from "../../../Model/Bot";
import {humanizeBotLastConnection} from "../../../Util/humanizeBotLastConnection";

interface InformationProps {
    bot: Bot,
    lastConnectionDiff: number,
}

const Information: React.FC<InformationProps> = (props: InformationProps) => {
    return (
        <div className="bot-item-information">
            <Divider orientation="left" style={{margin: "5px 0"}}>
                Information
            </Divider>

            <div className="bot-item-connect">
                <div className="bot-item-connect-info">
                    <i className="bot-item-connect-badge">
                        <span className="icon-bots-information-model" />
                    </i>
                    {props.bot.metadata.android} / {props.bot.metadata.model}
                </div>
                <div className="bot-item-connect-info">
                    <i className="bot-item-connect-badge">IP</i>
                    {props.bot.ip}
                </div>
                <div className="bot-item-connect-info">
                    <Tooltip placement="right" title="First connection..." destroyTooltipOnHide>
                        <i className="bot-item-connect-badge">FC</i>
                    </Tooltip>
                    {props.bot.created_at}
                </div>
                <div className="bot-item-connect-info">
                    <Tooltip placement="right" title="Last connection..." destroyTooltipOnHide>
                        <i className="bot-item-connect-badge">LC</i>
                    </Tooltip>
                    <span className={"bot-item-connect-last"}>
                        {humanizeBotLastConnection(props.lastConnectionDiff)}
                    </span>
                </div>
                {props.bot.comment && (
                    <div className="bot-item-connect-info">
                        <i className="bot-item-connect-badge">
                            <span className="icon-bots-information-comment" />
                        </i>

                        <span style={{flex: 1}}>
                            {props.bot.comment}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Information;
