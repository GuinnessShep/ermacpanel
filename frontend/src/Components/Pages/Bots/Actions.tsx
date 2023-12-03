import React, {useEffect, useState} from "react";
import {Modal, Space, Spin, Tooltip} from "antd";
import CommandsModal from "../../Modals/CommandsModal/CommandsModal";
import BotInjectsModal from "../../Modals/Injects/BotInjectsModal";
import {Bot} from "../../../Model/Bot";
import {deleteBots, setBotTypeValue} from "../../../Store/Bots/Actions";
import {useDispatch, useSelector} from "react-redux";
import {BotsState} from "../../../Store/Bots/Types";

interface ActionProps {
    bot: Bot,
}

const tooltipEnterDelay = 0.3;

const Actions: React.FC<ActionProps> = (props: ActionProps) => {
    const [showCommands, setShowCommands] = useState(false);
    const [showInjects, setShowInjects] = useState(false);

    const getBotAction = () => {
        dispatch(deleteBots([props.bot.id]));
    };

    const dispatch = useDispatch();

    const setTypeValue = (type: string) => {
        if (type === "favorite") {
            setFavoriteIsLoadingState(true);
            dispatch(setBotTypeValue(props.bot.id, type, !props.bot.is_favorite));
        } else {
            dispatch(setBotTypeValue(props.bot.id, type, !props.bot.is_blacklisted));
            setBlacklistIsLoadingState(true);
        }
    };

    const [favoriteIsLoadingState, setFavoriteIsLoadingState] = useState(false);
    const [blacklistIsLoadingState, setBlacklistIsLoadingState] = useState(false);

    const botsReducer = useSelector((state: BotsState) => state.bots);

    useEffect(() => {
        setFavoriteIsLoadingState(false);
        setBlacklistIsLoadingState(false);
    }, [botsReducer]);


    return (
        <>
            <div className="bot-item-actions">
                <div className="bot-item-actions-col">
                    <Space size="small">
                        <Tooltip
                            title="Add to favorites"
                            placement="bottom"
                            mouseEnterDelay={tooltipEnterDelay}
                            destroyTooltipOnHide
                        >
                            {/* тут проверяешь, если  первый useState = true - выводишь иконку загрузки,  если нет - выводишь кнопку*/}
                            <button className="bot-item-btn" onClick={() => setTypeValue("favorite")} disabled={favoriteIsLoadingState}>
                                {favoriteIsLoadingState ? (
                                    <Spin spinning={true} />
                                ) : (
                                    <span className={"icon-bot icon-button icon-bot-like filter-favorite " + (props.bot.is_favorite && "active")} />
                                )}
                            </button>
                        </Tooltip>

                        <Tooltip
                            title="Add to blacklist"
                            placement="bottom"
                            mouseEnterDelay={tooltipEnterDelay}
                            destroyTooltipOnHide
                        >
                            <button className="bot-item-btn" onClick={() => setTypeValue("blacklisted")} disabled={blacklistIsLoadingState}>
                                {blacklistIsLoadingState ? (
                                    <Spin spinning={true}/>
                                ) : (
                                    <span className={"icon-bot icon-button icon-bot-blacklist filter-blacklisted " + (props.bot.is_blacklisted && "active")} />
                                )}
                            </button>
                        </Tooltip>

                        <button
                            className="bot-item-btn"
                            onClick={() => setShowInjects(true)}
                        >
                            <span className="icon-bot icon-button icon-bot-injects" />
                        </button>


                        <button
                            className="bot-item-btn"
                            onClick={() => {
                                Modal.confirm({
                                    title: "Delete bot?",
                                    content: "This action can`t be undone",
                                    onOk: () => getBotAction(),
                                    okText: "Delete",
                                    okButtonProps: {
                                        danger: true,
                                    },
                                    centered: true,
                                });
                            }}
                        >
                            <span className="icon-bot icon-button icon-bot-delete" />
                        </button>
                    </Space>
                </div>
                <div className="bot-item-actions-col">
                    <button
                        className="bot-item-btn bot-item-btn-more"
                        onClick={() => setShowCommands(true)}
                    >
                        <span className="icon-bot icon-button icon-bot-commands" />
                    </button>
                </div>
            </div>

            <BotInjectsModal visible={showInjects} setVisible={setShowInjects} bot={props.bot} />
            <CommandsModal
                visible={showCommands}
                setVisible={(isVisible: boolean) => setShowCommands(isVisible)}
                bot={props.bot}
            />
        </>
    );
};

export default Actions;
